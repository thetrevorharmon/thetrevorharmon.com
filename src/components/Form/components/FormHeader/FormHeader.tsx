import React from 'react';

import {Header, Spacer, TextStyle} from '../../../../new-UI-Kit';

interface FormHeaderProps {
  title: string;
  tagline: string;
}

export const FormHeader = ({title, tagline}: FormHeaderProps) => {
  return (
    <Spacer size="tiny">
      <Header rank={3} type="Heading">
        {title}
      </Header>
      <TextStyle style="Body">{tagline}</TextStyle>
    </Spacer>
  );
};
