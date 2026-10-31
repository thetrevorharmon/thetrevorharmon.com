import type {ContentData} from './content.ts';

export interface ReadingListItem {
  slug: string;
  label: string;
  isLinkPost: boolean;
  date: Date | undefined;
}

const READING_LIST_SIZE = 3;

function sampleSize<T>(items: T[], count: number, random: () => number): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

/**
 * Builds up to three recommendations for `current`: its curated
 * `related_reading` picks first, then random picks from published entries of
 * the same type that opted in with `include_in_reading_list`.
 *
 * `random` is injectable so tests can be deterministic.
 */
export function buildReadingList(
  current: ContentData,
  all: ContentData[],
  random: () => number = Math.random,
): ReadingListItem[] {
  const curatedSlugs = current.related_reading ?? [];

  const available = all
    .slice() // sort() works in place, so copy first
    // sort first so that curated picks can come in any order
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
    .filter((c) => c.type === current.type && c.status === 'Published')
    .filter((c) => c.slug !== current.slug);

  const curatedPicks = curatedSlugs
    .map((slug) => available.find((c) => c.slug === slug))
    .filter((c): c is ContentData => c != null);

  const randomPicks = sampleSize(
    available
      // curated picks ignore the opt-in flag, random picks do not
      .filter((c) => c.include_in_reading_list)
      // skip anything the current entry already lists in its curated picks.
      // (The Gatsby version compared a candidate against its own list, so this
      // filter never removed anything.)
      .filter((c) => !curatedSlugs.includes(c.slug)),
    READING_LIST_SIZE,
    random,
  );

  return [...curatedPicks, ...randomPicks]
    .slice(0, READING_LIST_SIZE)
    .map((c) => ({
      slug: c.slug,
      label: c.title,
      isLinkPost: c.link != null,
      date: c.date,
    }));
}
