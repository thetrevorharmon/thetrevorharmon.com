import {graphql, useStaticQuery} from 'gatsby';
import {GatsbyImage} from 'gatsby-plugin-image';
import * as React from 'react';

import {Layout} from '../layouts';
import {Link} from '../UI-Kit';
import {ExternalLinks, Routes} from '../utils';

function AboutPage() {
  const data = useStaticQuery<Queries.AboutPageImageQuery>(graphql`
    query AboutPageImage {
      file(name: {eq: "about-page-image"}) {
        childImageSharp {
          gatsbyImageData(width: 700)
        }
      }
    }
  `);

  if (
    data.file == null ||
    data.file.childImageSharp == null ||
    data.file.childImageSharp.gatsbyImageData == null
  ) {
    return null;
  }

  const pageMetadata: PageMetadata = {
    title: 'About',
    url: Routes.about(),
  };

  return (
    <Layout className="body-styles" pageMetadata={pageMetadata}>
      <div className="my-huge">
        <h1 className="featured">
          <span>About</span>
        </h1>

        <div>
          <div className="Breakout">
            <GatsbyImage
              image={data.file.childImageSharp.gatsbyImageData}
              alt="Trevor Harmon walking through a group of trees"
            />
          </div>

          <div className="mt-medium">
            <p>Hi there! Welcome to my little space on the internet.</p>
            <p>
              First off, introductions. My name is Trevor Harmon and I love to
              build things. I've been designing and developing since CSS2 was a
              thing.
            </p>
            <p>
              I've worked on a variety of projects and have done everything from
              design to full-stack development. The thing I enjoy the most (and
              that people tend to say I'm good at) is front-end development. I
              currently write front-end code for Shopify.
            </p>
            <p>
              If you like my work, or just want to say hello, feel free to reach
              out <Link url={ExternalLinks.twitter()}>on Twitter</Link>.
            </p>
            <p>–Trevor</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AboutPage;
