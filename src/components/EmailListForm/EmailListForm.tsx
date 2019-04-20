import addToMailchimp from 'gatsby-plugin-mailchimp';
import * as React from 'react';

interface EmailListFormState {
  name?: string;
  email?: string;
}

interface MailchimpResult { 
  result: string;
  msg: string; 
}

export default class EmailListForm extends React.Component<{}, EmailListFormState> {
  // Since `addToMailchimp` returns a promise, you
  // can handle the response in two different ways:

  // Note that you need to send an email & optionally, listFields
  // these values can be pulled from React state, form fields,
  // or wherever.  (Personally, I recommend storing in state).

  // 1. via `.then`
  // _handleSubmit = e => {
    // e.preventDefault();
    // addToMailchimp(email, listFields) // listFields are optional if you are only capturing the email address.
    //   .then(data => {
    //     // I recommend setting data to React state
    //     // but you can do whatever you want (including ignoring this `then()` altogether)
    //     console.log(data)
    //   })
    //   .catch(() => {
    //     // unnecessary because Mailchimp only ever
    //     // returns a 200 status code
    //     // see below for how to handle errors
    //   })
  // }

  // 2. via `async/await`
  // _handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const result = await addToMailchimp(email, listFields)
  //   // I recommend setting `result` to React state
  //   // but you can do whatever you want
  // }

  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = 'thetrevorharmon+mailchimptest1@gmail.com';

    addToMailchimp(email)
    // listFields are optional if you are only capturing the email address.
      .then((data: MailchimpResult) => {
        // I recommend setting data to React state
        // but you can do whatever you want (including ignoring this `then()` altogether)
        console.log(data);
      })
      .catch((error: any) => {
        console.error(error);
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
