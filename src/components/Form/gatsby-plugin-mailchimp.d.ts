declare module 'gatsby-plugin-mailchimp' {
  import * as React from 'react';

  export enum MailchimpResult {
    Success = 'success',
    Error = 'error',
  }

  export interface MailchimpResponse {
    result: MailchimpResult;
    msg: string;
  }

  export interface MailchimpFields {
    [key: string]: string;
  }

  function addToMailchimp(
    email: String,
    listFields?: MailchimpFields,
  ): Promise<MailchimpResponse>;
  export default addToMailchimp;
}
