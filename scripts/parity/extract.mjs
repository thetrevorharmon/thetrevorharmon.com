// Pulls the facts we compare between the old and new site out of one HTML
// document. Used by scripts/parity/inventory.mjs (reads files from the old
// build) and by tests/parity (reads HTML served by a live site), so both sides
// are measured the same way.
import * as cheerio from 'cheerio';

const SITE_HOST = 'thetrevorharmon.com';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';

function clean(text) {
  return (text ?? '').replace(/\s+/g, ' ').trim();
}

function isExternal(href) {
  if (/^(mailto:|tel:)/i.test(href)) return true;
  if (!/^(https?:)?\/\//i.test(href)) return false;
  try {
    const url = new URL(href, `https://${SITE_HOST}`);
    return url.hostname.replace(/^www\./, '') !== SITE_HOST;
  } catch {
    return true;
  }
}

/** @param {string} html */
export function extractPage(html) {
  const $ = cheerio.load(html);

  const meta = {};
  $('meta[property], meta[name]').each((_, el) => {
    const key = $(el).attr('property') ?? $(el).attr('name');
    if (!key) return;
    if (/^(og:|twitter:|article:)/.test(key) || key === 'description') {
      meta[key] = $(el).attr('content') ?? '';
    }
  });

  const headingIds = [];
  $(HEADINGS).each((_, el) => {
    const id = $(el).attr('id');
    if (id) headingIds.push(id);
  });

  const footnoteIds = [];
  $('[id]').each((_, el) => {
    const id = $(el).attr('id');
    if (/^(footnote|reference)--|^footnote-label$/.test(id)) {
      footnoteIds.push(id);
    }
  });

  const footnoteLinks = [];
  $('a[href^="#footnote--"], a[href^="#reference--"]').each((_, el) => {
    footnoteLinks.push($(el).attr('href'));
  });

  // Content images only: skip Gatsby's aria-hidden blur-up placeholders.
  // <noscript> contents are text to cheerio, so they are not counted.
  const imageAlts = [];
  $('img').each((_, el) => {
    const $el = $(el);
    if (
      $el.attr('aria-hidden') === 'true' ||
      $el.attr('role') === 'presentation'
    ) {
      return;
    }
    imageAlts.push($el.attr('alt') ?? null);
  });

  const internalLinks = [];
  const outgoingLinks = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href').trim();
    if (isExternal(href)) outgoingLinks.push(href);
    else internalLinks.push(href);
  });

  // The reading list is random, so we only record its shape.
  let readingList = null;
  $('h2').each((_, el) => {
    const heading = clean($(el).text());
    if (
      heading !== 'Want to keep reading?' &&
      heading !== 'Want to see more?'
    ) {
      return;
    }
    const wrapper = $(el).parent().parent();
    const tiles = wrapper.children().last().children();
    const links = [];
    const dates = [];
    tiles.each((__, tile) => {
      links.push($(tile).find('a').first().attr('href') ?? null);
      dates.push(clean($(tile).children().last().text()));
    });
    readingList = {
      heading,
      description: clean($(el).next().text()),
      count: tiles.length,
      links,
      dates,
    };
  });

  return {
    title: clean($('head > title').first().text()) || null,
    description: meta.description ?? null,
    canonical: $('link[rel="canonical"]').attr('href') ?? null,
    meta,
    headingIds,
    footnoteIds,
    footnoteLinks,
    imageCount: imageAlts.length,
    imageAlts,
    internalLinks,
    outgoingLinks,
    readingList,
  };
}

/** Parses an RSS document into the items we compare. */
export function extractRss(xml) {
  const $ = cheerio.load(xml, {xmlMode: true});
  const items = [];
  $('item').each((_, el) => {
    const $el = $(el);
    items.push({
      guid: clean($el.children('guid').text()),
      link: clean($el.children('link').text()),
      title: clean($el.children('title').text()),
      pubDate: clean($el.children('pubDate').text()),
    });
  });
  return items;
}

/** Returns the pathname list from a sitemap, in document order. */
export function extractSitemap(xml) {
  const $ = cheerio.load(xml, {xmlMode: true});
  const locs = [];
  $('url > loc').each((_, el) => {
    locs.push(clean($(el).text()));
  });
  return locs;
}
