import type {ContentData} from './content.ts';

export interface ContentEntry {
  data: ContentData;
  /** Path of the source file, for example `src/content/blog/2024/x/x.mdx`. */
  filePath?: string;
}

/**
 * Checks that span more than one entry, which zod cannot express per entry:
 *  - the slug equals the file name
 *  - every `related_reading` slug is an existing entry
 *
 * Throws one error that lists every problem found, each with its file path.
 */
export function validateEntries(entries: ContentEntry[]): void {
  const slugs = new Set(entries.map((entry) => entry.data.slug));
  const problems: string[] = [];

  for (const {data, filePath} of entries) {
    const where = filePath ?? data.slug;

    if (filePath) {
      const fileName = filePath
        .split('/')
        .pop()!
        .replace(/\.mdx?$/, '');
      if (data.slug !== fileName) {
        problems.push(
          `${where}\n  Slug and file name must match (slug: "${data.slug}", file: "${fileName}")`,
        );
      }
    }

    for (const related of data.related_reading ?? []) {
      if (!slugs.has(related)) {
        problems.push(
          `${where}\n  related_reading must be an existing article (no entry with slug "${related}")`,
        );
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(`Invalid content:\n\n${problems.join('\n\n')}`);
  }
}
