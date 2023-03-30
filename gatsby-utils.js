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

    if (node.title == null || node.title == '') {
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

// Found this at https://gomakethings.com/how-to-shuffle-an-array-with-vanilla-js/
const shuffle = (array) => {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const chooseRandomElements = (original, list, numberOfElements = 3) => {
  // slice it so it passes by copy, not be reference
  const shuffledList = shuffle(list.slice());
  const chosenElements = [];
  shuffledList.forEach((element) => {
    if (
      chosenElements.length >= numberOfElements ||
      element.slug === original.slug
    ) {
      return;
    }
    chosenElements.push(element);
  });

  return chosenElements;
};

const buildReadingList = (item, items) => {
  const pickedItems = chooseRandomElements(item, items);
  const preparedItems = pickedItems
    .map((item) => ({
      link: {
        slug: item.slug,
        label: item.title,
      },
      date: item['date'],
    }))
    .sort((firstPair, secondPair) => {
      if (new Date(firstPair.date) > new Date(secondPair.date)) {
        return -1;
      } else {
        return 1;
      }
    });

  return preparedItems;
};

module.exports = {
  buildReadingList,
  validateNode,
};
