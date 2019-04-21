declare module 'gatsby-plugin-mailchimp' {
  import * as React from 'react';

  type MailchimpResult = "success" | "error";

  interface MailchimpResponse {
    result: MailchimpResult;
    msg: string;
  }

  interface MailchimpFields {
    [key: string]: string
  }

  function addToMailchimp(email: String, listFields?: MailchimpFields): Promise<MailchimpResponse>;
  export = addToMailchimp;
}
