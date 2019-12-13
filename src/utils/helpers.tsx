import {BlogPost, LinkPost} from '../types';

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

type Post = BlogPost | LinkPost;
interface CombinePostTypes {
  blogPosts: BlogPost[];
  linkPosts: LinkPost[];
  limit?: number;
  order?: 'desc' | 'asc';
}

const combinePostTypes = ({
  blogPosts,
  linkPosts,
  limit,
  order = 'desc',
}: CombinePostTypes): [BlogPost, Post[]] => {
  const directionMultiplier = order === 'desc' ? 1 : -1;

  const featuredPost = blogPosts.slice(0, 1)[0];
  const blogPostsMinusFeatured = blogPosts.slice(1, blogPosts.length);

  const posts = [...blogPostsMinusFeatured, ...linkPosts].sort(
    (firstPost, secondPost) => {
      const a = new Date(firstPost.date);
      const b = new Date(secondPost.date);

      if (a < b) {
        return 1 * directionMultiplier;
      }
      if (a > b) {
        return -1 * directionMultiplier;
      }

      return 0;
    },
  );

  const postsWithAdjustedLength = limit ? posts.slice(0, limit) : posts;

  return [featuredPost, postsWithAdjustedLength];
};

export {combinePostTypes, checkHttp};
