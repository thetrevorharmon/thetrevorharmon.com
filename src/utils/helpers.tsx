import { getSrc } from "gatsby-plugin-image";
import { FileNode } from "gatsby-plugin-image/dist/src/components/hooks";

const checkHttp = (link: string) => {
  const completeProtocol = /^https?/;
  const hasProtocol = completeProtocol.test(link);

  if (hasProtocol) {
    return link;
  }

  const partialProtocol = /^:?\/\//;
  const preparedLink = link.replace(partialProtocol, '');

  return `https://${preparedLink}`;
};

const getImageSrc = (node: Mdx | null, siteUrl?: string) => {
  if (node == null || node.image == null || node.image.source == null) {
    return null;
  }

  const src = getSrc(node.image.source as FileNode);

  if (src == null) {
    return null;
  }

  if (siteUrl == null) {
    return src;
  }

  return `${siteUrl}${src}`;
}

export {checkHttp, getImageSrc};
