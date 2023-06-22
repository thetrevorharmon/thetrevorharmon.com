const sampleSize = require('lodash.samplesize');
const ObjectShape = require('object-shape-validator').default;

const STATUSES = ['Archived', 'Published', 'Draft'];
const TYPES = ['Post', 'Project', 'Page'];

const validateNode = (node) => {
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

    if (node.type === 'Project') {
      if (node.client == null) {
        throw new NodeError(`Must include client`);
      }
    }
  }

  enforceNodeFields(node);
};

const buildReadingList = (nodes) => {
  const pickedNodes = sampleSize(nodes, 3);
  const preparedNodes = pickedNodes
    .map((node) => ({
      slug: node.slug,
      label: node.title,
      isLinkPost: node.link != null,
      date: node.date,
    }))
    .sort((firstNode, secondNode) => {
      if (new Date(firstNode.date) > new Date(secondNode.date)) {
        return -1;
      } else {
        return 1;
      }
    });

  return preparedNodes;
};

module.exports = {
  buildReadingList,
  validateNode,
};
