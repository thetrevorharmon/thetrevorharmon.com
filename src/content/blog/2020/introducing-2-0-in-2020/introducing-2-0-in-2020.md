---
title: Introducing 2.0 in 2020
slug: introducing-2-0-in-2020
date: 2020-01-09T10:54-08:00
type: Post
status: Published
description: The next version of thetrevorharmon.com
image:
  source: ./Sillhouette-of-a-Man-Jumping-near-a-Mountain.jpg
  alt: Sillhouette of a Man Jumping near a Mountain
  attribution:
    author: Joshua Earle
    sourceName: Unsplash
    sourceUrl: https://unsplash.com/photos/3yLpryRajZs
---

Sometime in early 2019 I started to have that itch. That feeling that every creator has when they regularly look at something they made. I felt that itch to build a new version of my site.

I built the first version of my site as a proof of concept. I wanted to learn how to use [Gatsby][2], and since [thetrevorharmon.com][1] had been sitting vacant for a few years, it felt like a natural fit. I challenged myself to release _something_ within a week's time. It didn't need to be great, but it needed to be publicly accessible. I cobbled together a site with some hastily written content, a first-draft design, and some mediocre code to go along with it.

By July 2019, I could no longer ignore that itch and started in on a redesign. I made a [Github issue][3] and a laundry list of all the things I wanted to change. I started on a design sometime in late September, and started development in early November. I got to a stopping point in mid December and stepped away for a few weeks for a holiday break.

## About my process

I plan to go into greater detail on my design and development process in future posts, but here are some high level points about this redesign:

- The entire process took about 6 months. The first half was spent exploring and deciding what I wanted, with most of the work happening in the second half.
- The [pull request][4] to implement the redesign includes 4,533 new lines of code and removes 3,607 lines. It was almost a complete rewrite of my site.
- Not included in the previous statistic is the addition of [dark mode][5] to the site that happened in November 2019. That was 1,433 new lines with 768 lines removed. That was a foundational piece that I decided to release separately.
- I made the conscious effort to care more about accessibility as part of this redesign. As a self-taught web developer, accessibility unfortunately tends to be later on the list of things to learn (and I'm finally further down the list). With this redesign, I improved the [Lighthouse][6] accessibility score from 89 to 97. I'm not "done" with accessibility, but moving in the right direction.
- Until now, I've only used fonts available on Google Fonts. I decided to use [Inter][7], and it's even a variable font! I have a post in the works that goes in depth about how I prepared and implemented the font.

## Lessons learned

What did I learn from this process?

- It was _really_ tempting to throw away my old repo and start from the ground up, but I instead decided to take an iterative approach. While difficult at times, I found that this kept me moving foward. I think it would have been more difficult to start over, because of how intimidating it would have been to start from zero.
- It's worth the time to focus on design and development separately. Before this I had tried to do both at the same time, but focusing on them separately kept me from getting bogged down in the code too early.
- Even for a small site like this one, redesigns are a lot of work!

The last thing to share is the code itself!

## Sharing my work

The most exciting thing for me is that I have decided to make the repo for this site a public repo. Shawn Wang has a great "golden rule" of [learning in public][8], and I want to do a better job of that. So if you want to see how I'm learning and see the work in progress that this site is, feel free to poke around the [Github repo][9].

I'm also keeping up the old design of this site at [previous.thetrevorharmon.com][10] (for a few months), and I would love to hear what you think about how this one compares. In what ways is this version better? Or worse? I'd love to hear what you think.

[1]: https://thetrevorharmon.com/
[2]: https://gatsbyjs.org
[3]: https://github.com/thetrevorharmon/thetrevorharmon.com/issues/35
[4]: https://github.com/thetrevorharmon/thetrevorharmon.com/pull/55
[5]: https://twitter.com/thetrevorharmon/status/1195458365389860865?s=20
[6]: https://developers.google.com/web/tools/lighthouse
[7]: https://rsms.me/inter/
[8]: https://www.swyx.io/writing/learn-in-public/
[9]: https://github.com/thetrevorharmon/thetrevorharmon.com
[10]: https://previous.thetrevorharmon.com
