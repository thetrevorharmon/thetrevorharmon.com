import classnames from 'classnames';
import * as React from 'react';

import {Link} from '../../components';
import {ExternalLinks, useSiteData} from '../../utils';

interface FooterProps {
  className?: string;
}

export const Footer = ({className}: FooterProps) => {
  const {title} = useSiteData();
  const classname = classnames(
    className,
    'flex flex-wrap',
    'border-t border-solid border-accent-line dark:border-accent-line-dark',
    'py-medium',
  );

  const footerLinks = [
    {
      display: 'Twitter',
      location: ExternalLinks.twitter(),
    },
    {
      display: 'Github',
      location: ExternalLinks.github(),
    },
    {
      display: 'LinkedIn',
      location: ExternalLinks.linkedIn(),
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
    <div className={classname}>
      <div className="uppercase font-black italic">
        &copy; {new Date().getFullYear()} {title}
      </div>
      {linkMarkup}
    </div>
  );
};
