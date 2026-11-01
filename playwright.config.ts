import {defineConfig} from '@playwright/test';

// The same suite runs against two sites:
//   old = the Gatsby site (gatsby-final worktree, `yarn serve` on :9000)
//   new = the Astro site (`astro preview` on :4321)
// Start the servers yourself; this config does not, unless you set
// START_PREVIEW=1 (CI does): then it runs `yarn preview` for the new site.
// The new site must be built first.
const OLD_URL = process.env.OLD_URL ?? 'http://localhost:9000';
const NEW_URL = process.env.NEW_URL ?? 'http://localhost:4321';

export default defineConfig({
  testDir: './tests/parity',
  // No {projectName} here on purpose: `--project=old --update-snapshots` saves
  // the screenshots and `--project=new` compares against those same files.
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFileName}/{arg}{ext}',
  timeout: 90_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  reporter: [
    ['list'],
    ['html', {open: 'never', outputFolder: 'playwright-report'}],
  ],
  outputDir: 'test-results',
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      // A small tolerance for anti-aliasing. Anything bigger is a real diff.
      threshold: 0.2,
      maxDiffPixelRatio: 0.002,
    },
  },
  use: {
    trace: 'off',
  },
  webServer: process.env.START_PREVIEW
    ? {
        // --ignore-lock keeps astro in the foreground (it daemonizes when it detects an AI agent).
        command: 'yarn preview --port 4321 --ignore-lock',
        url: NEW_URL,
        reuseExistingServer: false,
        timeout: 60_000,
      }
    : undefined,
  projects: [
    {name: 'old', use: {baseURL: OLD_URL}},
    {name: 'new', use: {baseURL: NEW_URL}},
  ],
});
