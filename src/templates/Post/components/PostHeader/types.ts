import {ContentfulAsset, ContentfulAttribution} from '../../../../types';
import {MetaProps} from '../../../../UI-Kit';

export interface PostHeaderProps {
  title: string;
  meta: MetaProps;
  image?: ContentfulAsset;
  photoAttribution?: ContentfulAttribution;
}
