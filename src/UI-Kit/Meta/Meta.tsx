import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import * as styles from './Meta.module.scss';

interface MetaProps {
  post: BlogPost | LinkPost;
  className?: string;
}

const Meta = ({post, className}: MetaProps) => {
  const theme = useTheme();
  const classname = classnames(className, styles[`Meta-${theme}`]);

  const timeToRead = post.body.childMarkdownRemark.timeToRead
    ? `${Math.floor(+post.body.childMarkdownRemark.timeToRead)} min read`
    : undefined;

  const meta = [post.date, timeToRead].filter(Boolean).join(' • ');

  return <p className={classname}>{meta}</p>;
};

export default Meta;
