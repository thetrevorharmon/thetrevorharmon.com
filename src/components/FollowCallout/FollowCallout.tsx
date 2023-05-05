import React from 'react';
import {Link} from '../../components';
import {ExternalLinks, useSiteData} from '../../utils';
import classnames from 'classnames';

export function FollowCallout() {
  const {feedUrl} = useSiteData();

  return (
    <div
      className={classnames([
        'BreakoutWithPadding',
        'shadow-lg',
        'border border-stone-500 dark:border-stone-400',
        'bg-gradient-to-br from-stone-100 to-stone-300',
        'dark:from-stone-700 dark:to-stone-900',
        'rounded-md',
        'py-medium md:py-big',
        'space-y-normal',
      ])}
    >
      <div className="space-y-tiny">
        <h2>Follow for the latest</h2>
        <div>
          <p>Get my posts in your feed of choice. Opt-out any time.</p>
        </div>
      </div>
      <ul className="space-y-little">
        <li>
          <Link
            url={ExternalLinks.twitter()}
            icon={{position: 'leading', name: 'twitter'}}
          >
            Follow me on Twitter
          </Link>
        </li>
        <li>
          <Link url={feedUrl} icon={{position: 'leading', name: 'rss'}}>
            Subscribe to the RSS feed
          </Link>
        </li>
        <li>
          <Link
            url={ExternalLinks.mailchimpSignupForm()}
            icon={{position: 'leading', name: 'email'}}
          >
            Get my emails
          </Link>
        </li>
      </ul>
    </div>
  );
}
