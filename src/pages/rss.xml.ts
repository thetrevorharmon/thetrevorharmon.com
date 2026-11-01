import rss from '@astrojs/rss';
import {getPublishedPosts} from '../lib/collections.ts';
import {siteData} from '../utils/site.ts';

const EXCERPT_LENGTH = 140;

/** A plain-text start of the post, like the excerpt Gatsby generated. */
function excerpt(body: string | undefined) {
  // Gatsby's excerpt was empty when a post opens with a one-line component, or
  // with a component whose children are not indented. This is a best-effort
  // match for what its MDX excerpt did; see docs/plan.md (Phase 8 notes).
  const [first = '', second = ''] = (body ?? '').trimStart().split('\n');
  if (/^<(\w+)[^\n]*<\/\1>\s*$/.test(first)) return '';
  if (/^<\w+[^>]*>\s*$/.test(first) && /^\S/.test(second)) return '';
  const text = (body ?? '')
    .replace(/<([A-Z]\w*)[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/^(import|export) .*$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/^\[[^\]]+\]:.*$/gm, '')
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[\^[^\]]*\]/g, '')
    .replace(/^#+ /gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s*\n\s*/g, ' ')
    .trim();
  if (text.length <= EXCERPT_LENGTH) return text;
  // Keep the cut as is when it already falls on a word boundary.
  if (/\s/.test(text[EXCERPT_LENGTH])) {
    return `${text.slice(0, EXCERPT_LENGTH).trim()}…`;
  }
  // Cut at the last word that fits, like Gatsby's excerpt does.
  return `${text
    .slice(0, EXCERPT_LENGTH)
    .replace(/\s+\S*$/, '')
    .trim()}…`;
}

// The old feed parsed the `DD MMM YYYY` date in the build machine's time zone
// (US Central), so every pubDate is local midnight there, not UTC midnight.
const centralHour = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Chicago',
  hour: 'numeric',
  hourCycle: 'h23',
});
function localMidnight(date: Date) {
  const day = date.toISOString().slice(0, 10);
  // Central is UTC-5 or UTC-6; pick the offset that lands on midnight.
  for (const hours of [5, 6]) {
    const candidate = new Date(`${day}T0${hours}:00:00Z`);
    if (Number(centralHour.format(candidate)) === 0) return candidate;
  }
  return date;
}

export async function GET() {
  const posts = await getPublishedPosts();
  return rss({
    title: "Trevor Harmon's Blog",
    description: siteData.description,
    site: siteData.siteUrl,
    xmlns: {
      dc: 'http://purl.org/dc/elements/1.1/',
      content: 'http://purl.org/rss/1.0/modules/content/',
      atom: 'http://www.w3.org/2005/Atom',
    },
    trailingSlash: false,
    items: posts.map((post) => {
      const summary = excerpt(post.body);
      return {
        title: post.data.title,
        description: post.data.description ?? summary,
        content: summary,
        // The old feed had no trailing slash on guid or link.
        link: `/blog/${post.data.slug}`,
        pubDate: localMidnight(post.data.date!),
        customData: `<guid isPermaLink="false">${siteData.siteUrl}/blog/${post.data.slug}</guid>`,
      };
    }),
  });
}
