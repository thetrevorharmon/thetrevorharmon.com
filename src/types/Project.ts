import {ContentfulBaseObject, ContentfulAsset} from './Contentful';

export interface ProjectPartial extends ContentfulBaseObject {
  title: string;
  slug: string;
  featureImage: ContentfulAsset;
  featureOnHomepage: boolean;
  projectCompletionDate?: Date;
}

export interface Project extends ProjectPartial {
  client?: string;
  description: {
    description: string;
    childMarkdownRemark?: MarkdownRemark;
  };
  projectImages: ContentfulAsset[];
}
