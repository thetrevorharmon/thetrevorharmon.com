---
title: 'Connecting ANTLR to CodeMirror 6: An Introduction'
slug: connecting-antlr-to-codemirror-6-an-introduction
date: 2023-05-10
type: Post
status: Draft
description: How to connect ANTLR to CodeMirror
---

For the past 18 months, I’ve been working on [ShopifyQL Notebooks][1], a data exploration tool offered by Shopify. The tool enables Shopify merchants to query their data in a [Jupiter-esque notebook][2] using [ShopifyQL][3], a SQLish language that was developed in-house. One of the biggest challenges in creating ShopifyQL Notebooks was building a functional code editor with all of the bells and whistles you’d expect from a world class editor.

In July 2022, it was my job to figure out how to get [CodeMirror][6] and ShopifyQL’s language server to talk. At the time, there was very little written about connecting CodeMirror with ANTLR (ShopifyQL’s parser & lexer engine)–only [this article][4] provided any direction for me. After working and staring at this for months, I’m finally on the other side of this journey. Here’s the guide I wish I had when I was tasked with connecting an ANTLR-powered language server with CodeMirror 6.

_Note: this article is the first in a series of three articles. This article explains the background for the concepts (CodeMirror, Lezer, ANTLR, Zephyr)._

## Lezer: CodeMirror’s parser generator

The CodeMirror package concerns itself with only the code editor itself; most of the language concerns are provided by a sibling package called [Lezer][5] (written by [Marijn Haverbeke][7], the author of both Lezer and CodeMirror). Lezer says it is “a very decent parser generator, especially well suited for use in code editors.” Lezer takes in a grammar file and then exports extensions that CodeMirror uses to create parse trees. Those parse trees are then used by CodeMirror to provide various features like syntax highlighting, linting, tooltips, etc.

The primary way to use Lezer is to use its grammar engine. For example, here is JSON defined as a Lezer grammar ([source][8]):

```
@top JsonText { value }

value { True | False | Null | Number | String | Object | Array }

String { string }
Object { "{" list<Property>? "}" }
Array  { "[" list<value>? "]" }

Property { PropertyName ":" value }
PropertyName { string }


@tokens {
  True  { "true" }
  False { "false" }
  Null  { "null" }

  Number { '-'? int frac? exp?  }
  int  { '0' | $[1-9] @digit* }
  frac { '.' @digit+ }
  exp  { $[eE] $[+\-]? @digit+ }

  string { '"' char* '"' }
  char { $[\u{20}\u{21}\u{23}-\u{5b}\u{5d}-\u{10ffff}] | "\\" esc }
  esc  { $["\\\/bfnrt] | "u" hex hex hex hex }
  hex  { $[0-9a-fA-F] }

  whitespace { $[ \n\r\t] }

  "{" "}" "[" "]"
}

@skip { whitespace }
list<item> { item ("," item)* }

@external propSource jsonHighlighting from "./highlight"

@detectDelim
```

The file defines the grammar for JSON, you can see at the bottom of the file it references the syntax highlighting definition:

```
@external propSource jsonHighlighting from "./highlight"
```

Lezer ingests the grammar files as well the referenced `./highlight` file and generates a parser based on those files. The extension (parser) is then passed to CodeMirror, and CodeMirror can now read and parse JSON.

However, there are cases where writing a Lezer grammar doesn’t make sense. For example, ShopifyQL has a grammar written in ANTLR that serves both client and server. In that case, it doesn’t make sense to rewrite an existing grammar (and maintain two separate grammar definitions). In these cases, you need to connect your ANTLR-powered language server to Lezer.

## What is ANTLR?

From the [ANTLR website][9]:

> ANTLR (ANother Tool for Language Recognition) is a powerful parser generator for reading, processing, executing, or translating structured text or binary files. It's widely used to build languages, tools, and frameworks. From a grammar, ANTLR generates a parser that can build and walk parse trees.

Much like Lezer, ANTLR is used to generate a parser based off of a grammar file. Unlike Lezer, ANTLR has applications far beyond CodeMirror. The grammar files that it uses are similar, but not quite the same. Here’s the ANTLR-style grammar for JSON ([source][10]):

```g4
grammar JSON;

json
   : value EOF
   ;

obj
   : '{' pair (',' pair)* '}'
   | '{' '}'
   ;

pair
   : STRING ':' value
   ;

arr
   : '[' value (',' value)* ']'
   | '[' ']'
   ;

value
   : STRING
   | NUMBER
   | obj
   | arr
   | 'true'
   | 'false'
   | 'null'
   ;


STRING
   : '"' (ESC | SAFECODEPOINT)* '"'
   ;


fragment ESC
   : '\\' (["\\/bfnrt] | UNICODE)
   ;


fragment UNICODE
   : 'u' HEX HEX HEX HEX
   ;


fragment HEX
   : [0-9a-fA-F]
   ;


fragment SAFECODEPOINT
   : ~ ["\\\u0000-\u001F]
   ;


NUMBER
   : '-'? INT ('.' [0-9] +)? EXP?
   ;


fragment INT
   : '0' | [1-9] [0-9]*
   ;

// no leading zeros

fragment EXP
   : [Ee] [+\-]? INT
   ;

// \- since - means "range" inside [...]

WS
   : [ \t\n\r] + -> skip
   ;
```

ANTLR can generate parsers in many languages. For example, the ANTLR grammar for ShopifyQL is used to generate parsers in both Go and Typescript. However, there isn’t any out-of-the-box compatibility between an ANTLR parser and CodeMirror/Lezer.

## Introducing: Zephyr

In order to demonstrate how to get CodeMirror and ANTLR connected, I decided to do what any sensible person would do: write my own toy language.

Introducing: Zephyr. Why “Zephyr”? I asked ChatGPT to make up a name for this little language and it said:

> How about “Zephyr”? It suggests a fresh, light, and airy language that can help developers build software quickly and easily. It also sounds distinct and memorable, which can help it stand out in a crowded programming language landscape.

So Zephyr it is!

I wrote this language in an ANTLR grammar as a language heavily inspired by Javascript. It features only a couple of features: variable assignments and comments. You can play with it in the code editor below:

```
<CodeEditor />
```

This code editor features an ANTLR language parser connected via a custom adapter to CodeMirror. While far from perfect, it is a working example of getting ANTLR and CodeMirror to talk!

## Up Next

My main goal for this article was to introduce all of the necessary background to understand why Zephyr even exists. In the next article, I’ll do a deep dive into the code that connects Zephyr’s language server with CodeMirror. But if you can’t wait that long (and to not leave you empty handed), feel free to explore the [full Zephyr demo site][11] along with the [source code][12] (I would recommend checking out the [ParserAdapter class][13] if you are really wanting to dig deeper).

[1]: https://apps.shopify.com/shopifyql-notebooks
[2]: https://jupyter.org/
[3]: https://shopify.dev/docs/api/shopifyql/shopifyql-reference
[4]: https://www.sumologic.com/blog/building-autocomplete-antlr-codemirror/
[5]: https://lezer.codemirror.net/
[6]: https://codemirror.net/
[7]: https://marijnhaverbeke.nl/
[8]: https://github.com/lezer-parser/json/blob/main/src/json.grammar
[9]: https://www.antlr.org/
[10]: https://github.com/antlr/grammars-v4/blob/master/json/JSON.g4
[11]: https://zephyr-demo.netlify.app/
[12]: https://github.com/thetrevorharmon/zephyr-demo
[13]: https://github.com/thetrevorharmon/zephyr-demo/blob/main/src/extensions/zephyr-lang/ParserAdapter.ts
