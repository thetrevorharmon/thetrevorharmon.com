import classnames from 'classnames';
import * as React from 'react';

import {Container, Link} from '../../components';
import {ExternalLinks} from '../../utils';

interface FooterProps {
  className?: string;
}

export const Footer = ({className}: FooterProps) => {
  const classname = classnames(className, 'flex flex-wrap', 'py-medium');

  const footerLinks = [
    {
      display: 'Twitter',
      location: ExternalLinks.twitter(),
    },
    {
      display: 'Github',
      location: ExternalLinks.github(),
    },
  ];

  const linkMarkup = (
    <ul
      className={classnames(
        'list-style-none',
        'p-0',
        'm-0 ml-auto',
        'w-full md:w-auto',
      )}
    >
      {footerLinks.map((link) => (
        <li
          key={link.display}
          className={classnames('inline-block', 'ml-small', 'first:ml-0')}
        >
          <Link url={link.location} target="_blank">
            {link.display}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="border-t border-solid border-accent-line dark:border-accent-line-dark">
      <Container>
        <div className={classname}>
          <div className="font-display font-bold text-text-bold dark:text-text-bold-dark">
            &copy; {new Date().getFullYear()} Trevor Harmon
          </div>
          {linkMarkup}
        </div>
      </Container>
    </div>
  );
};
