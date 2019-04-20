declare module 'gatsby-plugin-mailchimp' {
  import * as React from 'react';
  import addToMailchimp from 'gatsby-plugin-mailchimp';


  // export interface AddToMailchimpProps {
  //   email: String;
  //   fields: Object;
  // }

  export type addToMailchimp = (email: String, fields: Object) => Promise<any>;

  // addToMailchimp(email: String, fields: Object): Promise<any>;

  // const addToMailchimp<AddToMailchimpProps>

  // export default addToMailchimp < AddToMailchimpProps>

  // export default class Masonry extends React.Component<AddToMailchimpProps & React.HTMLProps<HTMLElement>, any> {
  //   render(): JSX.Element;
  // }
}
