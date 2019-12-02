import * as React from 'react';

import {Form} from '../../../../../components';
import {useTheme} from '../../../../../context/ThemeContext';
import {Container} from '../../../../../layouts/utils';
import * as styles from './PostSubscribeForm.module.scss';

const PostSubscribeForm = () => {
  const theme = useTheme();

  return (
    <div className={styles[`PostSubscribeForm-${theme}`]}>
      <Container>
        <Form />
      </Container>
    </div>
  );
};

export {PostSubscribeForm};
