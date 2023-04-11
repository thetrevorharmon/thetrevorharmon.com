import React from 'react';
import {Link} from '../../components';
import {ExternalLinks, useSiteData} from '../../utils';

export function FollowCallout() {
  const {feedUrl} = useSiteData();

  return (
    <div className="py-large space-y-normal">
      <div className="space-y-tiny">
        <h2>Want to read more?</h2>
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
