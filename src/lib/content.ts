// Plain shapes shared by the content helpers. These mirror the zod schema in
// `src/content.config.ts` but do not import from Astro, so the helpers can be
// unit tested with `node --test`.

export type ContentType = 'Post' | 'Page';
export type ContentStatus = 'Archived' | 'Published' | 'Draft';

export interface ContentData {
  title: string;
  slug: string;
  type: ContentType;
  date?: Date;
  status?: ContentStatus;
  description?: string;
  link?: string;
  include_in_reading_list?: boolean;
  related_reading?: string[];
}
