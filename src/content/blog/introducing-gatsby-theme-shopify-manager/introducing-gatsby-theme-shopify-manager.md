---
status: Archived
title: Introducing Gatsby Theme Shopify Manager
slug: introducing-gatsby-theme-shopify-manager
date: 2020-05-20T09:11-07:00
type: Post
description: The easiest way to build a Shopify store on Gatsby.
image:
  source: >-
    ./A-person-using-a-computer-that-shows-a-browser-window-open-to-view-gatsbythemeshopifymanagercom.png
  alt: >-
    A person using a computer that shows a browser window open to view
    gatsbythemeshopifymanager.com
  attribution:
    author: Lucrezia Carnelos
    sourceName: Unsplash
    sourceUrl: https://unsplash.com/photos/wQ9VuP_Njr4
---

Earlier this year, I spoke at [Gatsby Days LA][7] about integrating Shopify with Gatsby. As part of my talk, I built [Sell Things Fast][1] to demo the Shopify-Gatsby connection. After buildling and teaching about the process, it seemed to me that it should have been easier to build a working Shopify site on Gatsby. But, as I looked around, there wasn't a great plugin or theme that handled all the hard parts.

So I built it.

## My first gatsby theme

Today I'm releasing my first Gatsby theme to make this process easier than ever. Introducing: [Gatsby Theme Shopify Manager][2].

![Gatsby Theme Shopify Manager Social Header: The easiest way to build a Shopify store on Gatsby.](./Gatsby-Theme-Shopify-Manager-Social-Header-The-easiest-way-to-build-a-Shopify-store-on-Gatsby.png)

This data theme handles all of the hard work for you. All you have to do is:

1. Install the theme
2. Provide API credentials
3. Import hooks

And then start coding. 🚀

## Why a theme?

The [documentation for Gatsby themes][4] says this:

> Gatsby themes are plugins that include a gatsby-config.js file and add pre-configured functionality, data sourcing, and/or UI code to Gatsby sites.

I wanted GTSM to be an opinionated theme that did as much of the work as possible for developers. It includes the [gatsby-source-shopify][5] plugin as well as the [Shopify-buy][6] plugin, making it the only thing to install and configure in order to get a connection to Shopify up and running.

## Available now

Want to check it out for yourself? Head over to the [documentation/demo site][2] to read about how to use it!

[1]: https://github.com/thetrevorharmon/sell-things-fast
[2]: https://gatsbythemeshopifymanager.com
[3]: https://twitter.com/gill_kyle
[4]: https://www.gatsbyjs.org/docs/themes/what-are-gatsby-themes/
[5]: https://www.gatsbyjs.org/packages/gatsby-source-shopify/
[6]: https://www.npmjs.com/package/shopify-buy
[7]: https://www.gatsbyjs.com/gatsby-days/gatsby-days-los-angeles/
