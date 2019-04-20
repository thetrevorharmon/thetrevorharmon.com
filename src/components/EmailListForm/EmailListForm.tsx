import addToMailchimp from 'gatsby-plugin-mailchimp';
import * as React from 'react';

interface EmailListFormState {
  name?: string;
  email?: string;
}

// tslint:disable-next-line
type MailchimpResult = "success" | "error"; // ignoring because 'error' (single quotes) throws a lint error

interface MailchimpResponse {
  result: MailchimpResult;
  msg: string;
}

export default class EmailListForm extends React.Component<{}, EmailListFormState> {
  // Since `addToMailchimp` returns a promise, you
  // can handle the response in two different ways:

  // Note that you need to send an email & optionally, listFields
  // these values can be pulled from React state, form fields,
  // or wherever.  (Personally, I recommend storing in state).

  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = 'thetrevorharmon+mailchimptest1@gmail.com';

    addToMailchimp(email)
      .then((data: MailchimpResponse) => {
        // I recommend setting data to React state
        // but you can do whatever you want (including ignoring this `then()` altogether)
        console.log(data);
      })
      .catch((error: Error) => {
        console.error(error);
        console.log(error);
        // unnecessary because Mailchimp only ever
        // returns a 200 status code
        // see below for how to handle errors
      });
  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input name="email" type="text"/>
        <button type="submit">Submit!</button>
      </form>
    )
  }
}
