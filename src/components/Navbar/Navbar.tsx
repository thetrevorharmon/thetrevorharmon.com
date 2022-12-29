import React from 'react';

import {Link} from '../../UI-Kit';
import {Routes} from '../../utils';

import {BrandButton, ToggleThemeButton} from './components';

export const Navbar = () => {
  const navbarLinks = [
    {
      display: 'Blog',
      location: Routes.blog(),
    },
    {
      display: 'Projects',
      location: Routes.projects(),
    },
    {
      display: 'About',
      location: Routes.about(),
    },
  ];

  const linkMarkup = (
    <ul className="flex items-center list-style-none m-0 ml-auto p-0">
      {navbarLinks.map((link, index) => (
        <li key={index} className="ml-little desktop:ml-small first:ml-0">
          <Link url={link.location}>{link.display}</Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex py-small transition-all duration-200">
      <BrandButton />
      {linkMarkup}
      <ToggleThemeButton className="ml-small" />
    </div>
  );
};
