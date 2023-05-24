const sampleSize = require('lodash.samplesize');

const validateNode = (node) => {
  const name = node.internal.contentFilePath;

  class NodeError extends Error {
    constructor(message) {
      super(`${message}\n\n${name}`);
    }
  }

  function enforceNodeFields(node) {
    const fileName = node.internal.contentFilePath
      .split('/')
      .slice(-1)
      .pop()
      .split(/\.mdx?/)[0];

    if (fileName !== node.slug) {
      throw new NodeError(`Slug and file name must match`);
    }

    if (node.type == null) {
      throw new NodeError('Must include a type');
    }

    if (!['Project', 'Post'].includes(node.type)) {
      throw new NodeError(
        `Encountered ${node.type} as the node type–must include one of the following types (case sensistive): Post, Project`,
      );
    }

    if (node.status == null) {
      throw new NodeError('Must include a status');
    }

    if (!['Archived', 'Published', 'Draft'].includes(node.status)) {
      throw new NodeError(
        `Encountered ${node.status} as the node status–must include one of the following types (case sensistive): Archived, Published, Draft`,
      );
    }

    if (node.title == null || node.title === '') {
      throw new NodeError(`Must include title`);
    }

    if (node.slug == null) {
      throw new NodeError(`Must include slug`);
    }

    if (node.date == null) {
      throw new NodeError(`Must include date`);
    }

    if (
      node.image != null &&
      (node.image.source == null || node.image.alt == null)
    ) {
      throw new NodeError(`Must include source, alt if an image is passed`);
    }

    if (node.type === 'Post') {
      enforcePostFields(node);
    } else {
      enforceProjectFields(node);
    }
  }

  function enforcePostFields(node) {
    if (node.description == null && node.link == null) {
      throw new NodeError(`Must include description or link`);
    }

    if (node.image != null && node.image.attribution != null) {
      if (
        node.image.attribution.author == null ||
        node.image.attribution.sourceName == null ||
        node.image.attribution.sourceUrl == null
      ) {
        throw new NodeError(
          `Must include author, sourceName, sourceUrl if an image attribution is passed`,
        );
      }
    }
  }

  function enforceProjectFields(node) {
    if (node.client == null) {
      throw new NodeError(`Must include client`);
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
