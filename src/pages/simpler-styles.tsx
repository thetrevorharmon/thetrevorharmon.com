import {graphql} from 'gatsby';
import * as React from 'react';

import {Layout} from '../layouts';

export default () => {
  return (
    <Layout>
      <div className="my-huge">
        <h1 className="page">
          <span>
            {`<h1.page>: this is a page level header`}
          </span>
        </h1>
        <br />
        <br />
        <h1>
          <span>
            {`<h1>: this is a post level header`}
          </span>
        </h1>
        <br />
        <br />
        <h1>Header h1 - post</h1>
        <h2>Header h2</h2>
        <h3>Header h3</h3>
        <h4>Header h4</h4>
        <h5>Header h5</h5>
      </div>
    </Layout>
  );
};
