import classnames from 'classnames';
import {graphql} from 'gatsby';
import React, {useState} from 'react';

import {useTheme} from '../context/ThemeContext';
import {Layout} from '../layouts';
import {Button, Input} from '../new-UI-Kit';
import {Routes} from '../utils';
import * as styles from './redesign.module.scss';

interface AboutPageProps {
  data: {
    allContentfulAboutPage: {
      edges: [
        {
          node: AboutPageData;
        },
      ];
    };
  };
}

export default (props: AboutPageProps) => {
  const pageMetadata: PageMetadata = {
    description: 'Redesign',
    title: 'Redesign',
    url: '/redesign',
  };

  const theme = useTheme();
  const [inputValue, setInputValue] = useState<string | undefined>();
  const handleButtonClick = () => alert(inputValue);

  return (
    <Layout
      className={classnames(styles.AboutPage, styles[`AboutPage-${theme}`])}
      pageMetadata={pageMetadata}
    >
      <div className="row mb-5">
        <div className="col-lg-12">
          <Input
            label="Name"
            name="name"
            placeholder="John Smith"
            value={inputValue || ''}
            onChange={setInputValue}
          />
          <Input
            label="Email"
            name="email"
            placeholder="name@location.com"
            value={inputValue || ''}
            onChange={setInputValue}
          />
          <Button onClick={handleButtonClick} isFormButton>
            Submit
          </Button>
        </div>
      </div>
    </Layout>
  );
};
