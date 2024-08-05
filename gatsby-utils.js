const sampleSize = require('lodash.samplesize');
const ObjectShape = require('object-shape-validator').default;

const STATUSES = ['Archived', 'Published', 'Draft'];
const TYPES = ['Post', 'Project', 'Page'];

const validateNode = (node, nodes) => {
  const name = node.internal.contentFilePath;

  class NodeError extends Error {
    constructor(message) {
      super(`${message}\n\n${name}`);
    }
  }

  function throwError(error) {
    throw new NodeError(error);
  }

  function enforceNodeFields(node) {
    const fileName = node.internal.contentFilePath
      .split('/')
      .slice(-1)
      .pop()
      .split(/\.mdx?/)[0];

    const basicNodeShape = new ObjectShape({
      title: (value) => (value != null && value !== '') || 'Must include title',
      type: (value) =>
        TYPES.includes(value) ||
        `Must include type.\nPossible values: ${TYPES.join(', ')}`,
      slug: (value) => value === fileName || `Slug and file name must match`,
      includeInReadingList: (value) =>
        value !== true ||
        value !== false ||
        `includeInReadingList must be a boolean`,
    });

    basicNodeShape.validate(node).forEach(throwError);

    if (node.image) {
      const imageShape = new ObjectShape({
        source: (value) =>
          value != null || 'Must include source if image is passed',
        alt: (value) => value != null || 'Must include alt if image is passed',
      });

      imageShape.validate(node.image).forEach(throwError);
    }

    if (node.image && node.image.attribution) {
      const imageAttributionShape = new ObjectShape({
        author: (value) =>
          (value != null && value !== '') ||
          'Must include author if image attribution is passed',
        sourceName: (value) =>
          (value != null && value !== '') ||
          'Must include sourceName if image attribution is passed',
        sourceUrl: (value) =>
          (value != null && value !== '') ||
          'Must include sourceUrl if image attribution is passed',
      });

      imageAttributionShape
        .validate(node.image.attribution)
        .forEach(throwError);
    }

    if (['Post', 'Project'].includes(node.type)) {
      const postOrProjectNodeShape = new ObjectShape({
        date: (value) => value != null || value !== '' || 'Must include date',
        status: (value) =>
          STATUSES.includes(value) ||
          `Must include status.\nPossible values: ${STATUSES.join(', ')}`,
      });

      postOrProjectNodeShape.validate(node).forEach(throwError);
    }

    if (node.type === 'Post') {
      if (node.description == null && node.link == null) {
        throw new NodeError(`Must include description or link`);
      }

      if (node.description && node.description.length > 155) {
        throw new NodeError(`Description must be 155 characters or shorter`);
      }
    }

    if (node.type === 'Post' && node.relatedReading) {
      if (!Array.isArray(node.relatedReading)) {
        throw new NodeError(`Related reading must be an array`);
      }

      if (node.relatedReading.length < 1) {
        throw new NodeError(`Related reading must not be empty`);
      }

      if (node.relatedReading.length > 3) {
        throw new NodeError(`Related reading cannot be more than 3 items`);
      }

      node.relatedReading.forEach((relatedReadingSlug) => {
        const isExistingNode = nodes.some(
          (node) => node.slug === relatedReadingSlug,
        );

        if (!isExistingNode) {
          throw new NodeError(`Related reading must be an existing article`);
        }
      });
    }

    if (node.type === 'Project') {
      if (node.client == null) {
        throw new NodeError(`Must include client`);
      }
    }
  }

  enforceNodeFields(node);
};

const buildReadingList = (node, nodes) => {
  const availableNodes =
    // .sort() sorts in place, which will mess with the way that
    // gatsby-node generates the pages, so copy the array first
    nodes
      .slice()
      // sort at this step so that the curated picks can come first
      // even if they are not in chronological order
      .sort(function sortByNewestNodeFirst(firstNode, secondNode) {
        if (new Date(firstNode.date) > new Date(secondNode.date)) {
          return -1;
        } else {
          return 1;
        }
      })
      .filter(function removeUnpublishedNodes(currentNode) {
        return (
          currentNode.type === node.type && currentNode.status === 'Published'
        );
      })
      .filter(function removeCurrentNode(currentNode) {
        return currentNode.slug !== node.slug;
      });

  const curatedPicks = (node.relatedReading || [])
    .map((slug) => availableNodes.find((node) => node.slug === slug))
    .filter(Boolean);

  const randomPicks = sampleSize(
    // only choose from nodes that have opted in to be recommended
    // this does not apply to the curated picks, only unpublished nodes
    // are unavailable in that context
    availableNodes
      .filter((node) => node.includeInReadingList)
      // do not pick nodes that have already been manually included in the recommended reading
      .filter((node) => {
        if (node.relatedReading == null) {
          return true;
        }

        const isInCuratedPicks = node.relatedReading.includes(node.slug);

        return !isInCuratedPicks;
      }),
    3,
  );

  const readingList = [...curatedPicks, ...randomPicks].slice(0, 3);

  return readingList.map((node) => ({
    slug: node.slug,
    label: node.title,
    isLinkPost: node.link != null,
    date: node.date,
  }));
};

module.exports = {
  buildReadingList,
  validateNode,
};
