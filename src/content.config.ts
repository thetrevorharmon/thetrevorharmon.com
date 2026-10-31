import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import type {Loader} from 'astro/loaders';
import {z} from 'astro/zod';
import type {ImageMetadata} from 'astro';
import type {ContentData} from './lib/content.ts';
import {validateEntries} from './lib/validate-content.ts';

const STATUSES = ['Archived', 'Published', 'Draft'] as const;
const TYPES = ['Post', 'Page'] as const;

const nonEmpty = (message: string) => z.string().min(1, message);

// Frontmatter keys stay snake_case so no content has to change.
const contentSchema = ({image}: {image: () => z.ZodType<ImageMetadata>}) =>
  z
    .object({
      title: nonEmpty('Must include title'),
      slug: nonEmpty('Must include slug'),
      type: z.enum(TYPES, {
        error: `Must include type. Possible values: ${TYPES.join(', ')}`,
      }),
      date: z.coerce.date().optional(),
      status: z
        .enum(STATUSES, {
          error: `Must include status. Possible values: ${STATUSES.join(', ')}`,
        })
        .optional(),
      description: z
        .string()
        .max(155, 'Description must be 155 characters or shorter')
        .optional(),
      link: z.url().optional(),
      include_in_reading_list: z.boolean().default(false),
      related_reading: z
        .array(z.string())
        .min(1, 'Related reading must not be empty')
        .max(3, 'Related reading cannot be more than 3 items')
        .optional(),
      image: z
        .object({
          source: image(),
          alt: nonEmpty('Must include alt if image is passed'),
          title: z.string().optional(),
          attribution: z
            .object({
              author: nonEmpty(
                'Must include author if image attribution is passed',
              ),
              sourceName: nonEmpty(
                'Must include sourceName if image attribution is passed',
              ),
              sourceUrl: nonEmpty(
                'Must include sourceUrl if image attribution is passed',
              ),
            })
            .optional(),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      // Posts need more than pages do.
      if (data.type !== 'Post') return;
      if (!data.date) {
        ctx.addIssue({
          code: 'custom',
          path: ['date'],
          message: 'Must include date',
        });
      }
      if (!data.status) {
        ctx.addIssue({
          code: 'custom',
          path: ['status'],
          message: `Must include status. Possible values: ${STATUSES.join(', ')}`,
        });
      }
      if (data.description == null && data.link == null) {
        ctx.addIssue({
          code: 'custom',
          path: ['description'],
          message: 'Must include description or link',
        });
      }
    });

/**
 * `glob()` plus the checks that span more than one entry. They run once the
 * whole collection is loaded, so a bad slug or related_reading fails
 * `astro build`, `astro dev` and `astro sync`.
 */
function validatedGlob(options: Parameters<typeof glob>[0]): Loader {
  const inner = glob(options);
  return {
    ...inner,
    name: 'validated-glob',
    async load(context) {
      await inner.load(context);
      validateEntries(
        context.store.values().map((entry) => ({
          data: entry.data as unknown as ContentData,
          filePath: entry.filePath,
        })),
      );
    },
  };
}

// Posts live in `src/content/blog/<year>/<slug>/<slug>.{md,mdx}`. The glob
// loader uses the `slug` frontmatter field as the entry id.
const blog = defineCollection({
  loader: validatedGlob({pattern: '**/*.{md,mdx}', base: './src/content/blog'}),
  schema: contentSchema,
});

// Standalone pages (about, pumpkins) share the schema with `type: Page`.
const pages = defineCollection({
  loader: validatedGlob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/pages',
  }),
  schema: contentSchema,
});

export const collections = {blog, pages};
