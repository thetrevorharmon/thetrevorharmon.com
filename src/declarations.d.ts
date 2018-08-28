type Project = {
  title: string;
  slug: string;
  client?: string;
  description?: {
    id?: string;
    description: string;
  };
  projectCompletionDate?: Date;
  photos: [contentfulPhotos]
}

type contentfulPhotos = {
  id?: string;
  resolutions: {
    src: string;
  };
}
