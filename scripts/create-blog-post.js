#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const {program} = require('commander');

program
  .option('--title <title>', 'Title of the blog post')
  .action(({title}) => {
    if (!title) {
      console.error('Please provide a title for the blog post');
      process.exit(1);
    }

    const slug = slugify(title, {lower: true});

    const draftsPath = path.join(
      __dirname,
      '..',
      'src',
      'content',
      'blog',
      'drafts',
    );

    if (!fs.existsSync(draftsPath)) {
      fs.mkdirSync(draftsPath);
    }

    const folderPath = path.join(draftsPath, slug);

    const filePath = path.join(folderPath, `${slug}.mdx`);

    if (fs.existsSync(folderPath)) {
      console.error(`Folder ${slug} already exists`);
      process.exit(1);
    }

    fs.mkdirSync(folderPath);

    const today = new Date().toISOString().slice(0, 10);

    const frontmatter = `---
title: "${title}"
date: ${today}
slug: "${slug}"
type: Post
status: Draft
description: ""
---

Content goes here
`;

    fs.writeFileSync(filePath, frontmatter);

    console.log(`Blog post ${title} created at ${folderPath}`);
  })
  .parse(process.argv);
