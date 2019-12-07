import classnames from 'classnames';
import * as React from 'react';

import {useTheme} from '../../context/ThemeContext';
import {BlogItem, Breakout, Icon, Image, Spacer} from '../../UI-Kit';
import {BlogItemProps} from '../BlogItem';
import * as styles from './FeaturedItem.module.scss';

interface FeaturedItemProps extends BlogItemProps {
  image: ContentfulAsset;
}

export const FeaturedItem = ({
  image,
  title,
  meta,
  linkHref,
  description,
  className,
}: FeaturedItemProps) => {
  const theme = useTheme();
  const classname = classnames([
    styles.FeaturedItem,
    styles[`FeaturedItem-${theme}`],
    className,
  ]);

  return (
    // TODO: add star to bottom right corner
    <Breakout>
      <div className={classname}>
        <Spacer size="medium">
          <Image src={image} />
          <BlogItem
            title={title}
            meta={meta}
            linkHref={linkHref}
            description={description}
          />
        </Spacer>
        <Icon name="star" size="large" className={styles.Icon} />
      </div>
    </Breakout>
  );
};
