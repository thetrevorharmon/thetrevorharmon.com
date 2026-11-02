import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {formatDate, withTrailingSlash} from './format.ts';

describe('formatDate', () => {
  it('formats as DD MMM YYYY in UTC', () => {
    assert.equal(formatDate(new Date('2019-06-06')), '06 Jun 2019');
    assert.equal(formatDate(new Date('2024-11-25')), '25 Nov 2024');
  });
  it('returns null without a date', () => {
    assert.equal(formatDate(undefined), null);
  });
});

describe('withTrailingSlash', () => {
  it('adds a slash to internal paths', () => {
    assert.equal(withTrailingSlash('/blog/a'), '/blog/a/');
    assert.equal(withTrailingSlash('/about#work'), '/about/#work');
    assert.equal(withTrailingSlash('/blog'), '/blog/');
  });
  it('leaves other URLs alone', () => {
    assert.equal(withTrailingSlash('/'), '/');
    assert.equal(withTrailingSlash('/blog/a/'), '/blog/a/');
    assert.equal(withTrailingSlash('https://x.com/a'), 'https://x.com/a');
    assert.equal(withTrailingSlash('#top'), '#top');
    assert.equal(withTrailingSlash('/rss.xml'), '/rss.xml');
  });
});
