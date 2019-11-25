import addToMailchimp, {
  MailchimpResponse,
  MailchimpResult,
} from 'gatsby-plugin-mailchimp';
import React, {useEffect, useState} from 'react';

import {Input, Spacer} from '../../new-UI-Kit';
import {ExternalLinks} from '../../utils';
import {useSiteData} from '../../utils/hooks';
import {
  FormButton,
  FormContainer,
  FormFooter,
  FormHeader,
  FormSuccess,
} from './components';
import * as styles from './Form.module.scss';
import {strings} from './strings';
import {
  openMailchimpFallback,
  splitNameIntoParts,
  validateEmailInput,
  validateNameInput,
} from './utils';

enum FormState {
  Default,
  Loading,
  Submitted,
}

export const Form = () => {
  const {feedUrl, mailchimpFallbackUrl} = useSiteData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState(FormState.Default);

  const [isNameValid, setNameValid] = useState(true);
  const [isEmailValid, setEmailValid] = useState(true);

  useEffect(() => {
    setNameValid(validateNameInput(name));
    setEmailValid(validateEmailInput(email));
  }, [name, email]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isNameValid || !isEmailValid || name === '' || email === '') {
      return;
    }

    const fields = splitNameIntoParts(name);
    setFormState(FormState.Loading);

    setTimeout(() => {
      setFormState(FormState.Submitted);
    }, 2000);

    await addToMailchimp(email, fields)
      .then((data: MailchimpResponse) => {
        // TODO: it would be nice if this could be MailchimpResult.Success
        // but that isn't working ATM
        if (data.result === 'success') {
          setFormState(FormState.Submitted);
        } else {
          // tslint:disable-next-line
          console.error(data.msg);

          setFormState(FormState.Default);
          openMailchimpFallback(email, fields, mailchimpFallbackUrl);
        }
      })
      .catch((error: Error) => {
        // Errors in here are client side
        // Mailchimp always returns a 200
        // tslint:disable-next-line
        console.error(error); // allowing this console.error so that I can see any errors in production

        setFormState(FormState.Default);
        openMailchimpFallback(email, fields, mailchimpFallbackUrl);
      });
  };

  const formMarkup = (
    <Spacer size="medium">
      <FormHeader title={strings.title} tagline={strings.tagline} />
      <form onSubmit={handleFormSubmit} className={styles.Form}>
        <Input
          label="Name"
          name="name"
          placeholder="John"
          value={name}
          onChange={setName}
          isValid={isNameValid}
          isFullWidth
        />
        <Input
          label="Email"
          name="email"
          placeholder="name@location.com"
          value={email}
          onChange={setEmail}
          isValid={isEmailValid}
          isFullWidth
        />
        <FormButton
          className={styles.SubmitButton}
          isLoading={formState === FormState.Loading}
          isDisabled={
            !isNameValid || !isEmailValid || formState === FormState.Loading
          }
        >
          Sign Up
        </FormButton>
      </form>
      <FormFooter
        twitter={{link: ExternalLinks.twitter(), label: strings.twitter}}
        rss={{link: feedUrl, label: strings.rss}}
      >
        {strings.footer}
      </FormFooter>
    </Spacer>
  );

  return (
    <FormContainer>
      {formState === FormState.Submitted ? (
        <FormSuccess name={name} />
      ) : (
        formMarkup
      )}
    </FormContainer>
  );
};
