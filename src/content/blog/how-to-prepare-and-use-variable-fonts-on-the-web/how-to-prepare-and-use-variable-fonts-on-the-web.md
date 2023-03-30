---
title: How to prepare and use variable fonts on the web
slug: how-to-prepare-and-use-variable-fonts-on-the-web
date: 2020-01-27T14:40-07:00
type: Post
description: A primer on subsetting, formatting, and CSS font features.
image:
  source: >-
    ./A-picture-of-a-large-letter-A-in-a-sans-serif-font-and-a-small-letter-A-in-a-serif-font.jpg
  alt: >-
    A picture of a large letter A in a sans serif font and a small letter A in a
    serif font
  attribution:
    author: Alexander Andrews
    sourceName: Unsplash
    sourceUrl: https://unsplash.com/photos/zw07kVDaHPw
---

When I [redesigned my blog][1], I decided to move away from using [Work Sans][2] and instead go with a newish font called [Inter][3], a lovely typeface by [Rasmus Andersson][4]. Inter isn't on Google fonts like Work Sans is, and I knew that if I wanted to use Inter, I would need to do a bit more legwork. In this article, I'll walk you through the legwork I had to do to prepare and use the variable font variant of Inter, and how I was able to use only a _single_ 43KB font file for every variation and weight!

## A brief introduction to variable fonts

[Envato Tuts+][5] describes what a variable font is:

> A variable font can contain a font’s entire glyph set, or individual glyphs with up to 64,000 axes of variation, including weight, width, slant, and, in some cases, specific styles, such as Condensed, Bold, etc.

To put it simple–you only have a single file for _all_ font variations instead of a file _per_ variation. When you're using custom fonts on the web, this means fewer files and faster load times.

Variable font support in the browser is fairly new–[Can I use][8] shows that browsers started supporting variable fonts in 2018. In practical usage, if you want to display a custom font, you'll probably want to make sure to include "legacy" non-variable fonts as a fallback.

## Preparing the font

Before importing and using the font, you'll want to prepare it. This in includes:

1. Subsetting
2. Converting it to the right (compressed) format

Font subsetting is the practice of removing unused glyphs from fonts to make them smaller. In the case of Inter, there are many glyphs that I won't need. Michael Herold put together [a great guide][9] all about subsetting fonts that explains how to use a python tool called `pyftsubset` found in [fonttools][10]. I would recommend reading his article, as it goes into much greater depth than this one on subsetting.

And, since we're using `pyftsubset`, we get the added benefit of file type conversion & font compression as well! 🎉

Here's the command I used to subset & compress Inter:

```bash
pyftsubset Inter.otf \
  --unicodes="U+0020-007F,U+00A0-00FF,U+0100-017F,U+2192" \
  --layout-features="" \
  --flavor="woff2" \
  --output-file="Inter-subset.woff2"
```

The previous article I mentioned can explain this command in greater detail, but at a high level, here's what's happening:

1. `--unicodes`: This flag accepts ranges of unicodes for which glyphs to keep. The specific ranges I'm using are unicode ranges that represent upper and lowercase letters, numbers, and the → character.
2. `--layout-features`: This flag enables OpenType features like tabular numbers or ligatures. I decided to strip all of the features for now, and add them in later if I need them.
3. `--flavor`: This flag lets you choose your "flavor" (or format), which in this case is `woff2`.
4. `--output-file`: The name of the output file from the command.

Before this command, the font file was 780 KB, after subsetting and compression, it's only 43 KB! That's **5%** of the size of the original file. 🤯

## Using the font

Now that the font is prepared, it's time to use it on a site. This requires us to first import the font, and then add a few CSS tweaks to tell our font how to behave.

### Importing the font

Here is the initial import code that I used:

```scss
@font-face {
  font-family: 'Inter Variable', sans-serif;
  src: url('../fonts/Inter-Variable-subset.woff2') format('woff2');
  font-weight: 1 999;
  font-display: swap;
}
```

Typically when importing a font, you set the `font-weight` property to an explicit value like `700`. Because this font represents a range of font weights, I pass it a range that encompasses all possible font-weight values.

Because not all browers support variable fonts, I'm also including a "static" (non-variable) version of Inter. Because I want to use multiple weights, that requires me to use multiple files–here's just one example of what those import statements look like:

```scss
@font-face {
  font-family: 'Inter Static', sans-serif;
  src: url('../fonts/Inter-BlackItalic-subset.woff2') format('woff2'), url('../fonts/Inter-BlackItalic-subset.woff')
      format('woff');
  font-weight: 900;
  font-style: italic;
  font-display: swap;
}
```

### Using variable font features

Utilizing the features of a variable font looks different than a normal font. For example, when you want a normal font to be bold, you simply tell it to have a font weight of bold:

```scss
font-weight: bold;
```

Because variable font features (such as weight) exist along an axis, the value for bold isn't predefined. Instead, you define it with the `font-variation-settings` attribute:

```scss
font-variation-settings: 'wght' 700;
```

You can define more than one variation setting in a single attribute, like this:

```scss
font-variation-settings: 'wght' 700, 'ital' 1;
```

### A note about italics

Something that I found particularly confusing when using Inter as a variable font was getting italics to behave consistently between browsers. With some variable fonts (including Inter), you can define a slant value:

```scss
font-variation-settings: 'slnt' -10;
```

This renders the font _slanted_ like an italic font. Unfortuantely, browser's don't yet agree on how exactly to render the font: some will approach this in an additive way (so `font-style: italic` plus `'slnt' -10` results in a VERY slanted font), while others only will pick one.

Initially I tried to set the `font-style` to `normal` on any element that used the variable font (to avoid the additive "superslant" behavior), but that has unintended side effects. While I was trying to solve this, I came across the `font-style` value of `oblique` on [MDN][11]:

> Italic font faces are generally cursive in nature, usually using less horizontal space than their unstyled counterparts, while oblique faces are usually just sloped versions of the regular face.

With Inter in particular, it seemed to respect `oblique` in ways that it didn't respect `italic`. In order to make the behavior consistent, I updated my import statement:

```scss
@font-face {
  font-family: 'Inter Variable';
  src: url('../fonts/Inter-Variable-subset.woff2') format('woff2');
  font-weight: 1 999;
  font-style: oblique 0deg 10deg;
  font-display: swap;
}
```

By defining an oblique font-style with a range of 0 to 10 degrees, it gives explicit instruction to browsers about what to expect about the font. Then, when I define italics, I can use the following:

```scss
font-variation-settings: 'slnt' -10;
font-style: oblique 10deg;
```

### Using @supports to smooth out issues

Because I'm using two fonts (variable and "static" versions of the same font, Inter), I have a bit of juggling to do between those browsers that support variable fonts and those that don't. Thankfully, we can use `@supports` in CSS. [MDN][12] defines the `@supports` rule as:

> The @supports CSS at-rule lets you specify declarations that depend on a browser's support for one or more specific CSS features.

I want to have conditional CSS for variable fonts, so I can wrap declarations in `@supports`, like this:

```scss
@supports (font-variation-settings: normal) {
  /* CSS goes here */
}
```

Here's an example of how I use it to handle italics between the two fonts:

```css
em,
i {
  font-style: italic;

  @supports (font-variation-settings: normal) {
    font-variation-settings: 'slnt' -10;
    font-style: oblique 10deg;
  }
}
```

## Putting it all together

After working through all of the challenges I faced, my final code looks something like this:

```scss
@supports (font-variation-settings: normal) {
  @font-face {
    font-family: 'Inter Variable';
    src: url('../fonts/Inter-Variable-subset.woff2') format('woff2');
    font-weight: 1 999;
    font-style: oblique 0deg 10deg;
    font-display: swap;
  }
}

@font-face {
  font-family: 'Inter Static';
  src: url('../fonts/Inter-subset.woff2') format('woff2'), url('../fonts/Inter-subset.woff')
      format('woff');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

html {
  font-family: 'Inter Static', -apple-system, sans-serif;

  @supports (font-variation-settings: normal) {
    font-family: 'Inter Variable' -apple-system, sans-serif;
  }
}

em,
i {
  font-style: italic;

  @supports (font-variation-settings: normal) {
    font-variation-settings: 'slnt' -10;
    font-style: oblique 10deg;
  }
}

b,
strong {
  font-weight: bold;

  @supports (font-variation-settings: normal) {
    font-variation-settings: 'wght' 700;
  }
}
```

If you want to see all of the code, feel free to poke around on [Github][17].

## Conclusion & Further Reading

I've been hearing about variable fonts for the past year or so, and after using them, they are as cool as I thought! Font weight and slant are only the [tip of the iceberg][13] with what is possible with variable fonts. If you want to dive deeper with variable fonts, here are some other resources to check out:

- [Variable Fonts (website)][7] by Nick Sherman. This is a great site that shows a wide variety of variable fonts and what properties exist on them.
- [How to use variable fonts in the real world][14] by Richard Rutter. I used his post as a starting point for learning about this and couldn't have made it as far as I did without it.
- [Introduction to variable fonts on the web][6] by Mustafa Kurtuldu. This Google web fundamentals article is a great high level take.
- [Variable fonts, a new kind of font for flexible design][15] by Tim Brown. This is the announcement post on Typekit's blog after Variable Fonts were announced at the ATypI conference in 2016.
- [Variable fonts guide][16] on MDN. This guide is as in-depth and helpful as you'd expect from something on MDN.

[1]: https://thetrevorharmon.com/blog/introducing-2-0-in-2020
[2]: https://fonts.google.com/specimen/Work+Sans
[3]: https://rsms.me/inter/
[4]: https://twitter.com/rsms
[5]: https://design.tutsplus.com/articles/what-are-variable-fonts--cms-31310
[6]: https://developers.google.com/web/fundamentals/design-and-ux/typography/variable-fonts
[7]: https://v-fonts.com/
[8]: https://caniuse.com/#feat=variable-fonts
[9]: https://michaeljherold.com/2015/05/04/creating-a-subset-font/
[10]: https://github.com/behdad/fonttools
[11]: https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
[12]: https://developer.mozilla.org/en-US/docs/Web/CSS/@supports
[13]: https://www.axis-praxis.org/specimens/zycon
[14]: http://clagnut.com/blog/2390
[15]: https://blog.typekit.com/2016/09/14/variable-fonts-a-new-kind-of-font-for-flexible-design/
[16]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts/Variable_Fonts_Guide
[17]: https://github.com/thetrevorharmon/thetrevorharmon.com/blob/master/src/styles/fonts.scss
