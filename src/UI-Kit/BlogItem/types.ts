export interface BlogItemProps {
  title: string;
  meta: JSX.Element; // TODO: can I enforce type of Meta here?
  linkHref: string;
  description: string;
  className?: string;
}
