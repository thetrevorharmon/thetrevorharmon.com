// Collection queries shared by the pages. These use `astro:content`, so unlike
// the other helpers in this folder they are not unit tested.
import {getCollection, type CollectionEntry} from 'astro:content';
import type {ContentData} from './content.ts';
import {buildReadingList} from './reading-list.ts';

export type BlogEntry = CollectionEntry<'blog'>;

const byDateDescending = (a: BlogEntry, b: BlogEntry) =>
  (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0);

/** Every entry in `src/content/blog` (all statuses), newest first. */
export async function getAllPosts(): Promise<BlogEntry[]> {
  return (await getCollection('blog')).sort(byDateDescending);
}

/** Posts with `status: Published`, newest first. */
export async function getPublishedPosts(): Promise<BlogEntry[]> {
  return (await getAllPosts()).filter(
    (post) => post.data.type === 'Post' && post.data.status === 'Published',
  );
}

/** Posts with `status: Draft`, newest first. */
export async function getDraftPosts(): Promise<BlogEntry[]> {
  return (await getAllPosts()).filter((post) => post.data.status === 'Draft');
}

/** The reading list for one post (curated picks first, then random ones). */
export function getReadingList(post: BlogEntry, all: BlogEntry[]) {
  return buildReadingList(
    post.data as unknown as ContentData,
    all.map((entry) => entry.data as unknown as ContentData),
  );
}
