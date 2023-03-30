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

const getRecommendedItems = (item, items, dateAccessor) => {
  const pickedItems = chooseRandomElements(item, items);
  const preparedItems = pickedItems
    .map((item) => ({
      link: {
        slug: item.slug,
        label: item.title,
      },
      date: item[dateAccessor],
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
  getRecommendedItems,
};
