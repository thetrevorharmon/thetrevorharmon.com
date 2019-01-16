import classnames from 'classnames';
import Img, { GatsbyImageProps } from 'gatsby-image';
import * as React from 'react';

interface ImageProps extends GatsbyImageProps {
  src: contentfulAsset;
}

const Image: React.SFC<ImageProps> = ({
  className,
  src,
  children,
  ...props
}) => {

  const classname = classnames(
    className,
  );

  return src ? (
    <Img
      className={classname}
      fluid={src.fluid}
      alt={`${src.title} | ${src.description}`}
      {...props}
    />
  ) : (
    <span />
  );
};

export default Image;
