import * as React from 'react';

import {Form} from '../../../../../components';

interface PostSubscribeFormProps {
  layoutClassName: string;
}

// TODO: 🔥 this component
const PostSubscribeForm = ({layoutClassName}: PostSubscribeFormProps) => {
  return (
    <div className="row my-5 my-lg-6">
      <div className={layoutClassName}>
        <Form />
      </div>
    </div>
  );
};

export {PostSubscribeForm};
