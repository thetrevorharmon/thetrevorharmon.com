export interface PostFooterProps {
  title: string;
  data: LinkDatePair[];
}

export interface LinkDatePair {
  link: {
    href: string;
    label: string;
  };
  date: Date;
}
