import addToMailchimp from 'gatsby-plugin-mailchimp';
import React, { useState } from 'react';

const EmailListForm: React.FunctionComponent<{}> = () => {

  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addToMailchimp(email)
      .then((data) => {
        alert(data.result);
      })
      .catch((error: Error) => {
        // Errors in here are client side
        // Mailchimp always returns a 200
        // tslint:disable-next-line
        console.error(error); // allowing this console.error so that I can see any errors in production
      });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="text" onChange={handleEmailChange} />
      <button type="submit">Subscribe</button>
    </form>
  );
};

export default EmailListForm;
