import {createHash} from 'node:crypto';
import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const root = new URL('../../', import.meta.url).pathname;
const inputs = ['src/markdown', 'src/lib/lqip.mjs', 'yarn.lock', 'src/content'];
// Posts are cached by Astro on their own text, but the image plugin also reads the
// image files next to them (size, placeholder), so those count too. The posts don't.
const skip = /\.mdx?$/;

function files(path) {
  const full = join(root, path);
  try {
    return readdirSync(full, {recursive: true, withFileTypes: true})
      .filter(
        (entry) =>
          entry.isFile() && !skip.test(entry.name) && entry.name[0] !== '.',
      )
      .map((entry) => join(entry.parentPath, entry.name))
      .sort();
  } catch {
    return [full];
  }
}

/**
 * A hash of everything that changes how markdown renders but that Astro's
 * content cache can't see: plugin code (functions are dropped when Astro hashes
 * the config), the lqip helper, the installed plugin versions and the image files the plugin reads.
 */
export function markdownCacheKey() {
  const hash = createHash('sha1');
  for (const path of inputs.flatMap(files)) {
    hash.update(path.replace(root, '')).update(readFileSync(path));
  }
  return hash.digest('hex').slice(0, 12);
}
