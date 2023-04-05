---
title: How to use Apple Font Tools to tweak a font
slug: how-to-use-apple-font-tools-to-tweak-a-font
date: 2018-06-19T14:13-08:00
type: Post
status: Published
description: >-
  I used Apple’s font tools to fix the line-height of a font for an iOS app.
  Here’s how I did it.
---

Recently I was working on embedding a custom font into the [Neighbor](http://neighbor.com/ 'Neighbor.com, the AirBnB of Storage') [iOS app](https://itunes.apple.com/us/app/neighbor-peer-to-peer-storage/id1323303687?mt=8 "Neighbor's iOS app"). I discovered that the font I was trying to embed had an issue with the rendered line height, and looked terrible on an multi-line string. Rather than trying to convert everything to an attributed string, I decided to try to make changes to the font itself. Here are the steps I took to make that happen, and some gotchas I ran into:

(I’m assuming that you’re using macOS if you’re reading this. I don’t know if this would work on any other operating system.)

## 1. Download Apple’s (free!) Font Tools

Turns out that Apple has a set of command line font tools that (among other things) enable you to manipulate a font as an xml file. You can find those tools on [Apple’s developer font page](https://developer.apple.com/fonts/ "Apple's Font Page for Developers"). On the bottom right you’ll find “Download the Apple Font Tool Suite”. You’ll need an Apple developer account to access the files (you can get an account for free).

Once you log in, download the OS X Font Tools released in 2011. The file to download is “OS X Font Tools Release 4, beta 1.dmg”. You’ll notice that this was released 7 years ago–this is the first gotcha that we’ll have to get around.

## 2. Install the Font Tools

Because the tools were released so long ago (and haven’t been updated since then), installing the font tools isn’t straightforward, but it’s still possible. [Here’s a gist](http://gist.github.com/thetrevorharmon/9afdeb41a74f8f32b9561eeb83b10eff) with all the steps you’ll need.

## 3. Use the font tools to modify a file

Now that the font tools are up and running, you’re off to the races! In my particular font, the spacing between the line was really poor, so I decided to work on increasing the ascender property of the font.

In order to edit the properties, you have to convert a font into an xml file, edit the file, and convert it back. I’m working with a font called Sailec, so you’ll see that as the font name in the commands I use. I’ve also not tried to run these from another directory, because I’m fairly sure that you need to have the xml file output in the same directory (for when you convert it back).

### 3a. Convert the font to xml

To convert a font, you run:

```shell
ftxdumperfuser -t hhea -A d {font_name}
```

This outputs an xml document with a table called `hheaTable`. Here’s what [the Apple documentation](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6hhea.html "Apple's documentation about TrueType fonts") describes this table as:

> The 'hhea' table contains information needed to layout fonts whose characters are written horizontally, that is, either left to right or right to left. This table contains information that is general to the font as a whole. Information which pertains to specific glyphs is given in the 'hmtx' table defined below.

The table looks like this (in my case):

```xml
<hheaTable
 versionMajor=”1"
 versionMinor=”0"
 ascender=”750"
 descender=”-250"
 lineGap=”250"
 advanceWidthMax=”1226"
 minLeftSideBearing=”-209"
 minRightSideBearing=”-210"
 xMaxExtent=”1188"
 caretSlopeRise=”1"
 caretSlopeRun=”0"
 caretOffset=”0"
 metricDataFormat=”0"
 numberOfHMetrics=”497"
 />
```

I increased the ascender property, and after some trial and error, I found that 1000 worked best for my use case and for this font.

### 3b. Convert the xml back to a font

To convert it back to a font (with the changed values), you use the command:

```shell
ftxdumperfuser -t hhea -A f {font}
```

This takes the values from the `hhea` table that you just edited and modifies the font to use those values.

## Additional Reading

- Shaunseo wrote an [article about custom font-line height](http://shaunseo.blogspot.com/2013/05/custom-font-line-height.html 'Blog post about using Apple Font Tools to fix line height') and using the Apple font tools (this was my starting point)
- [This stackExchange post](https://apple.stackexchange.com/questions/211138/apple-font-tools-cannot-install-in-macbook-pro-el-capitan 'A stack exchange post about unpacking an old dmg') helped explain how to unpack the installer (at least partially)
