const checkHttp = (link: string) => {
  const completeProtocol = /^https?/;
  const hasProtocol = completeProtocol.test(link);

  if (hasProtocol) { return link; }

  const partialProtocol = /^:?\/\//;
  const preparedLink = link.replace(partialProtocol, '');

  return `https://${preparedLink}`;
};

interface BlogPostEdges {
  edges: [
    {
      node: BlogPost,
    }
  ];
}

interface LinkPostEdges {
  edges: [
    {
      node: LinkPost,
    }
  ];
}

type PostOrder = 'desc' | 'asc';

const combinePostTypes = (blogPosts: BlogPostEdges, linkPosts: LinkPostEdges, order: PostOrder = 'desc') => {
  const orderMultiplier = order === 'desc' ? 1 : -1;

  const posts = [
    // blog posts
    ...blogPosts.edges.map((edge) => edge.node),
    // link posts
    ...linkPosts.edges.map((edge) => edge.node),
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

export {
  combinePostTypes,
  checkHttp,
};
