import {MailchimpFields} from 'gatsby-plugin-mailchimp';

export const validateNameInput = (value: string) => {
  const nameRegex = /^[a-zA-Z\ ]+$/g;
  const isValid = nameRegex.test(value);
  return isValid;
};

export const validateEmailInput = (value: string) => {
  // this came from https://emailregex.com/
  // tslint:disable-next-line
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
  const isValid = emailRegex.test(value);
  return isValid;
};

export const splitNameIntoParts = (name: string): MailchimpFields => {
  const [firstName, ...lastName] = name.split(' ');

  if (lastName.length > 0) {
    return {
      FNAME: firstName,
      LNAME: lastName.join(' '),
    };
  } else {
    return {
      FNAME: firstName,
    };
  }
};

export const openMailchimpFallback = (
  userEmail: string,
  userFields: MailchimpFields,
  fallbackUrl?: string,
) => {
  if (fallbackUrl) {
    // Merge fields lets us prefill fields in Mailchimp
    let mergeFields = `&MERGE0=${encodeURI(userEmail)}`;
    Object.keys(userFields).forEach((key, index) => {
      mergeFields += `&MERGE${index + 1}=${userFields[key]}`;
    });

    window.open(`${fallbackUrl}${mergeFields}`, '_blank');
  }
};
