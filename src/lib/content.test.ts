import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {ContentData} from './content.ts';
import {buildReadingList} from './reading-list.ts';
import {validateEntries} from './validate-content.ts';

const post = (slug: string, extra: Partial<ContentData> = {}): ContentData => ({
  title: `Title ${slug}`,
  slug,
  type: 'Post',
  status: 'Published',
  date: new Date('2024-01-01'),
  include_in_reading_list: true,
  ...extra,
});

test('validateEntries passes for matching slugs and existing related reading', () => {
  validateEntries([
    {
      data: post('a', {related_reading: ['b']}),
      filePath: 'src/content/blog/a/a.mdx',
    },
    {data: post('b'), filePath: 'src/content/blog/b/b.md'},
  ]);
});

test('validateEntries rejects a slug that does not match the file name', () => {
  assert.throws(
    () =>
      validateEntries([
        {data: post('a'), filePath: 'src/content/blog/a/other.mdx'},
      ]),
    /Slug and file name must match/,
  );
});

test('validateEntries rejects a related_reading slug that does not exist', () => {
  assert.throws(
    () =>
      validateEntries([
        {
          data: post('a', {related_reading: ['missing']}),
          filePath: 'src/content/blog/a/a.mdx',
        },
      ]),
    /no entry with slug "missing"/,
  );
});

test('buildReadingList puts curated picks first, in order', () => {
  const all = [
    post('current', {related_reading: ['old', 'older']}),
    post('old', {date: new Date('2020-01-01'), include_in_reading_list: false}),
    post('older', {date: new Date('2019-01-01')}),
    post('x'),
    post('y'),
    post('z'),
  ];
  const list = buildReadingList(all[0], all, () => 0.5);
  assert.deepEqual(
    list.slice(0, 2).map((i) => i.slug),
    ['old', 'older'],
  );
  assert.equal(list.length, 3);
});

test('buildReadingList never repeats curated picks or the current entry', () => {
  const all = [
    post('current', {related_reading: ['a']}),
    post('a'),
    post('b'),
    post('c'),
    post('d'),
  ];
  for (let i = 0; i < 50; i++) {
    const slugs = buildReadingList(all[0], all).map((item) => item.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.ok(!slugs.includes('current'));
  }
});

test('buildReadingList skips drafts, archived and other types', () => {
  const all = [
    post('current'),
    post('draft', {status: 'Draft'}),
    post('archived', {status: 'Archived'}),
    post('page', {type: 'Page'}),
    post('ok'),
  ];
  assert.deepEqual(
    buildReadingList(all[0], all).map((i) => i.slug),
    ['ok'],
  );
});
