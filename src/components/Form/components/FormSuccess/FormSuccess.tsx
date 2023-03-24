import React from 'react';

import {Header, TextStyle} from '../../../../UI-Kit';

interface FormSuccessProps {
  name: string;
}

export const FormSuccess = ({name}: FormSuccessProps) => {
  const strings = {
    body: `You'll be getting my articles in your inbox.`,
    heading: `Thanks for signing up, ${name}!`,
  };

  return (
    <div className="flex h-full flex-col justify-center text-center space-y-tiny">
      <Header rank={3} type="Heading">
        {strings.heading}
      </Header>
      <p>
        <TextStyle style="Body">{strings.body}</TextStyle>
      </p>
    </div>
  );
};
