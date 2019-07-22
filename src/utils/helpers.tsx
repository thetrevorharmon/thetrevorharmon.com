import { Routes } from '../utils';

const checkHttp = (link: string) => {
  const completeProtocol = /^https?/;
  const hasProtocol = completeProtocol.test(link);

  if (hasProtocol) { return link; }

  const partialProtocol = /^:?\/\//;
  const preparedLink = link.replace(partialProtocol, '');

  return `https://${preparedLink}`;
};

interface PostEdges { edges: [{ node: BlogPost | LinkPost }]; }

const combinePostTypes = (
  blogPosts: PostEdges,
  linkPosts: PostEdges,
  order: ('desc' | 'asc') = 'desc',
): Array<BlogPost | LinkPost> => {
  const orderMultiplier = order === 'desc' ? 1 : -1;

  const posts = [
    // blog posts
    ...blogPosts.edges.map((edge) => {
      const blogPost: BlogPost = {
        ...edge.node as BlogPost,
        postType: 'Blog',
      };

      return blogPost;
    }),
    // link posts
    ...linkPosts.edges.map((edge) => {
      const linkPost: LinkPost = {
        ...edge.node as LinkPost,
        postType: 'Link',
      };

      return linkPost;
    }),
  ].sort(
    (firstDate, secondDate) => {
      const a = new Date(firstDate.date);
      const b = new Date(secondDate.date);

      if (a < b) { return 1 * orderMultiplier; }
      if (a > b) { return -1 * orderMultiplier; }

      return 0;
    },
  );

  return posts;
};

const twitterShareUrl = (post: BlogPost | LinkPost, siteData: SiteMetadata) => {
  const twitterText = encodeURI(`I just finished reading "${post.title}" by ${siteData.twitter.author}`);
  const postAbsoluteUrl = `${siteData.siteUrl}${Routes.blogPost(post.slug)}`;
  const shareUrl = `https://twitter.com/intent/tweet?url=${postAbsoluteUrl}&text=${twitterText}`;

  return shareUrl;
};

export {
  combinePostTypes,
  checkHttp,
  twitterShareUrl,
};
