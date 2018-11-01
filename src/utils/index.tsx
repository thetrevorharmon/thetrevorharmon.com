export function largestPhotoFromSet(photo: contentfulAsset): string {
  if (photo.resolutions === undefined || (photo.resolutions.srcSet === undefined && photo.resolutions.src === undefined)) {
    throw "No Photo Source in Data. Try looking at your graphQL statement and make sure either a src or srcSet is included."
  }

  if (photo.resolutions.srcSet === undefined) {
    return photo.resolutions.src
  }

  const photoSet = photo.resolutions.srcSet.split(',');
  let photoWithSizeSet: { [key: string]: string; } = {};

  photoSet.map((item) => {
    const items: string[] = item.split(' ');

    let size: string = items[1];
    let url: string = items[0].trim();

    photoWithSizeSet[size] = url;
  })

  return photoWithSizeSet['3x'] || photoWithSizeSet['2x'] || photoWithSizeSet['1.5x'] || photoWithSizeSet['1x'] 
}
