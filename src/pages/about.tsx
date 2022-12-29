import classnames from 'classnames';
import {graphql} from 'gatsby';
import * as React from 'react';

import {useTheme} from '../context/ThemeContext';
import {Layout} from '../layouts';
import {
  ContentfulAsset,
  ContentfulBaseObject,
  ContentfulLongText,
} from '../types';
import {Breakout, Header, Image} from '../UI-Kit';
import {Routes} from '../utils';

interface AboutPageData extends ContentfulBaseObject {
  title: string;
  post: ContentfulLongText;
  featureImage: ContentfulAsset;
}

interface AboutPageProps {
  data: {
    allContentfulAboutPage: allContentfulNodes<AboutPageData>;
  };
}

export default (props: AboutPageProps) => {
  const aboutPage = props.data.allContentfulAboutPage.nodes[0];

  const pageMetadata: PageMetadata = {
    description: aboutPage.post.childMarkdownRemark.excerpt || '',
    title: 'About',
    url: Routes.about(),
  };

  const theme = useTheme();

  return (
    <Layout className="body-styles" pageMetadata={pageMetadata}>
      <div className="space-y-huge my-huge">
        <Header rank={1} type="Display">
          {aboutPage.title}
        </Header>

        <div className="space-y-medium">
          <Breakout>
            <Image src={aboutPage.featureImage} />
          </Breakout>

          <div
            dangerouslySetInnerHTML={{
              __html: aboutPage.post.childMarkdownRemark.html,
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query AboutPageQuery {
    allContentfulAboutPage {
      nodes {
        title
        featureImage {
          ...ContentfulAsset
        }
        post {
          childMarkdownRemark {
            html
            excerpt
          }
          internal {
            type
          }
        }
      }
    }
  }
`;
