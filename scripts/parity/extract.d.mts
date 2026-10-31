export interface ReadingList {
  heading: string;
  description: string;
  count: number;
  links: (string | null)[];
  dates: string[];
}
export interface PageFacts {
  title: string | null;
  description: string | null;
  canonical: string | null;
  meta: Record<string, string>;
  headingIds: string[];
  footnoteIds: string[];
  footnoteLinks: string[];
  imageCount: number;
  imageAlts: (string | null)[];
  internalLinks: string[];
  outgoingLinks: string[];
  readingList: ReadingList | null;
}
export interface RssItem {
  guid: string;
  link: string;
  title: string;
  pubDate: string;
}
export function extractPage(html: string): PageFacts;
export function extractRss(xml: string): RssItem[];
export function extractSitemap(xml: string): string[];
