// The components every post and page can use without importing them. This
// replaces the old MdxProvider; pages pass it to `<Content components={...} />`.
import Breakout from '../components/Breakout/Breakout.astro';
import Callout from '../components/Callout/Callout.astro';
import Carousel from '../components/Carousel/Carousel.astro';
import Citation from '../components/Citation/Citation.astro';
import Link from '../components/Link/Link.astro';
import TwoUp from '../components/TwoUp/TwoUp.astro';

export const mdxComponents = {
  Breakout,
  Callout,
  Carousel,
  Citation,
  Link,
  TwoUp,
};
