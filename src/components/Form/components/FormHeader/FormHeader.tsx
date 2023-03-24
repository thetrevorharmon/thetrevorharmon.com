import React from 'react';

import {Header, TextStyle} from '../../../../UI-Kit';

interface FormHeaderProps {
  title: string;
  tagline: string;
}

export const FormHeader = ({title, tagline}: FormHeaderProps) => {
  return (
    <div className="space-y-tiny">
      <Header rank={3} type="Heading">
        {title}
      </Header>
      <TextStyle style="Body">{tagline}</TextStyle>
    </div>
  );
};
