import React from 'react';

import {Header, Spacer, TextStyle} from '../../../../UI-Kit';
import * as styles from './FormSuccess.module.scss';

interface FormSuccessProps {
  name: string;
}

export const FormSuccess = ({name}: FormSuccessProps) => {
  const strings = {
    body: `You'll be getting my articles in your inbox.`,
    heading: `Thanks for signing up, ${name}!`,
  };

  return (
    <div className={styles.FormSuccess}>
      <Spacer size="tiny">
        <Header rank={3} type="Heading">
          {strings.heading}
        </Header>
        <p>
          <TextStyle style="Body">{strings.body}</TextStyle>
        </p>
      </Spacer>
    </div>
  );
};
