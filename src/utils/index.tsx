export function largestPhotoFromSet(photo: contentfulAsset): string {
  if (photo.resolutions === undefined || (photo.resolutions.srcSet === undefined && photo.resolutions.src === undefined)) {
    throw "No Photo Source in Data. Try looking at your graphQL statement and make sure either a src or srcSet is included."
  }

  if (photo.resolutions.srcSet === undefined) {
    return photo.resolutions.src
  }


  const photoSet = photo.resolutions.srcSet.split(',');
  let photoWithSizeSet = {}

  photoSet.map((item) => {
    const items = item.split(' ');
    photoWithSizeSet[items[1]] = items[0].trim()
  })

  return photoWithSizeSet['3x'] || photoWithSizeSet['2x'] || photoWithSizeSet['1.5x'] || photoWithSizeSet['1x'] 
}
