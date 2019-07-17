import addToMailchimp from 'gatsby-plugin-mailchimp';
import React, { useState } from 'react';
import * as styles from './EmailListForm.module.scss';

import classnames from 'classnames';

const EmailListForm: React.FunctionComponent<{}> = ({children}) => {

  const [isSendingSignupRequest, setSignupIsRequesting] = useState(false);
  const [isSignupComplete, setSignupComplete] = useState(false);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [hasEmailError, setEmailError] = useState(false);
  const [hasNameError, setNameError] = useState(false);

  const prepareNameFields = (subscriberName: string) => {
    const nameParts = subscriberName.split(' ');
    if (nameParts.length === 1) {
      return {
        FNAME: nameParts[0],
      };
    } else {
      return {
        FNAME: nameParts.shift(),
        LNAME: nameParts.join(' '),
      };
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    checkForError(name, 'name', setNameError);
    checkForError(email, 'email', setEmailError);

    if (hasEmailError || hasNameError) {
      return;
    }

    const fields = {
      ...prepareNameFields(name),
    };

    setSignupIsRequesting(true);

    setTimeout(() => {
      setSignupComplete(true);
    }, 3000);

    // addToMailchimp(email)
    //   .then((data) => {
    //     alert(data.result);
    //   })
    //   .catch((error: Error) => {
    //     // Errors in here are client side
    //     // Mailchimp always returns a 200
    //     // tslint:disable-next-line
    //     console.error(error); // allowing this console.error so that I can see any errors in production
    //   });
  };

  type fieldType = 'name' | 'email';
  const checkForError = (value: string, type: fieldType, setError: (value: boolean) => void) => {
    const regex = {
      // this came from https://emailregex.com/
      // tslint:disable-next-line
      email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g,
      name: /^[a-zA-Z\ ]+$/g,
    };

    setError(!(regex[type].test(value)));
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
    checkForError(event.currentTarget.value, 'name', setNameError);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
    checkForError(event.currentTarget.value, 'email', setEmailError);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={classnames(
        styles.EmailListForm,
        'row',
      )}
    >
      <div
        className={classnames(
          styles.SubscribeCallout,
          'col-sm-5',
          'py-3',
          'px-4',
        )}
      >
        <h2 className="mt-3">Sign up for the Newsletter</h2>
        <p>Get articles like this one in your inbox.</p>
        <div className="mt-auto">
          {children}
        </div>
      </div>
      <div
        className={classnames(
          styles.DataEntry,
          isSignupComplete && styles.SignupComplete,
          'col-sm-7',
          'py-3',
          'px-4',
        )}
      >
        <div className={styles.SignupFields}>
          <label>Name</label>
          <input
            placeholder="Name"
            name="name"
            type="text"
            className={classnames(hasNameError && styles.Error)}
            onChange={handleNameChange}
          />
          <label className="mt-2 d-inline-block">Email</label>
          <input
            placeholder="Email address"
            name="email"
            type="text"
            className={classnames(hasEmailError && styles.Error)}
            onChange={handleEmailChange}
          />
          <button
            type="submit"
            className="mt-3 mb-2"
            disabled={isSendingSignupRequest}
          >
            Subscribe
          </button>
        </div>

        <div className={styles.SignupCompletionMessage}>
          <div>
            <h2 className="mt-0">{name}, thank you for signing up!</h2>
            <p className="mb-2">Check your email for confirmation.</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EmailListForm;
