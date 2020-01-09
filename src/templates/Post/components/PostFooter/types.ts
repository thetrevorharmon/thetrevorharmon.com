export interface PostFooterProps {
  title: string;
  data: LinkDatePair[];
  getFullLink(slug?: string): string;
}

export interface LinkDatePair {
  link: {
    slug: string;
    label: string;
  };
  date: string;
}
