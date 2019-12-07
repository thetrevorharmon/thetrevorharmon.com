import classnames from 'classnames';
import React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {Header, Link, Spacer} from '../../UI-Kit';
import * as styles from './LinkList.module.scss';

interface LinkDatePair {
  link: {
    href: string;
    label: string;
  };
  date: Date;
}

interface LinkListProps {
  title: string;
  data: LinkDatePair[];
}

export const LinkList = ({title, data}: LinkListProps) => {
  const theme = useTheme();
  const makePairMarkup = ({link: {href, label}, date}: LinkDatePair) => {
    return (
      <div className={styles.Pair} key={label}>
        <Link className={styles.Link} href={href}>
          {label}
        </Link>
        <span className={classnames([styles.Date, styles[`Date-${theme}`]])}>
          {/* TODO: fix this when you are getting formatted dates */}
          {date.toDateString()}
        </span>
      </div>
    );
  };

  const markup = data.map(makePairMarkup);

  return (
    <div className={styles.LinkList}>
      <Spacer size="small">
        <Header rank={2} type="Heading">
          {title}
        </Header>
        <Spacer size="little">{markup}</Spacer>
      </Spacer>
    </div>
  );
};
