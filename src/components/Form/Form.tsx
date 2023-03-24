import classnames from 'classnames';
import addToMailchimp, {
  MailchimpResponse,
  MailchimpResult,
} from 'gatsby-plugin-mailchimp';
import React, {useEffect, useState} from 'react';

import {Input} from '../../UI-Kit';
import {ExternalLinks, useSiteData} from '../../utils';
import {
  FormButton,
  FormContainer,
  FormFooter,
  FormHeader,
  FormSuccess,
} from './components';
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

    await addToMailchimp(email, fields)
      .then((data: MailchimpResponse) => {
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
    <div className="space-y-medium">
      <FormHeader title={strings.title} tagline={strings.tagline} />
      <form
        onSubmit={handleFormSubmit}
        className={classnames(
          'flex flex-col [&>*]:mb-small last:mb-0',
          'desktop:grid desktop:grid-cols-form desktop:gap-x-small',
        )}
      >
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
          className="self-end"
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
    </div>
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
