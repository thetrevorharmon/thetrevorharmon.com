import {expect, test} from '@playwright/test';

// Edge labels ("Yes"/"No") must sit inside their background box. Merman once
// centred the text on x=0 while drawing the box to the right of it.
//   npx playwright test mermaid.spec.ts --project=old
//   npx playwright test mermaid.spec.ts --project=new

const POSTS = [
  '/blog/displaying-mermaid-charts-in-gatsby/',
  '/blog/learning-codemirror/',
  '/blog/codemirror-and-react/',
  '/blog/advanced-state-management-with-react-and-codemirror/',
];

for (const path of POSTS) {
  test(`mermaid edge labels sit inside their boxes: ${path}`, async ({page}) => {
    await page.goto(path);
    const labels = await page.$$eval('.Mermaid .edgeLabel', (groups) =>
      groups.flatMap((g) => {
        const text = g.querySelector('text');
        if (!text?.textContent?.trim()) return [];
        const box = g.querySelector('rect');
        if (!box) return [{text: text.textContent, inside: false}];
        const t = text.getBoundingClientRect();
        const r = box.getBoundingClientRect();
        const tolerance = 1;
        return [
          {
            text: text.textContent,
            inside:
              t.left >= r.left - tolerance &&
              t.right <= r.right + tolerance &&
              t.top >= r.top - tolerance &&
              t.bottom <= r.bottom + tolerance,
          },
        ];
      }),
    );
    for (const label of labels) {
      expect(label.inside, `label "${label.text}" is outside its box`).toBe(
        true,
      );
    }
  });
}
