---
title: Three Simple Ways to Write Cleaner Code
slug: three-simple-ways-to-write-cleaner-code
date: 2019-04-23T09:49-07:00
type: Post
status: Published
description: >-
  Three practices you can start today that will make your code more readable now
  and easier to understand in the future.
image:
  source: ./Man-with-beard-coding-on-MacBook-Pro.jpg
  alt: Man with beard coding on MacBook Pro
  attribution:
    author: Danial RiCaRoS
    sourceName: Unsplash
    sourceUrl: https://unsplash.com/photos/FCHlYvR5gJI
---

I've been reviewing a lot of code lately and have seen some good and not-so-good practices. There is code that works, and then there is code that works _and_ reads well. Here are three easy ways to write cleaner, more readable code.

## 1. Learn and Follow Conventions

Almost every language has specific naming conventions. [Functions and variables in Python][1] are `snake_cased`. [Javascript functions][2] are `camelCased`. If you're writing a CSS class it will [probably][3] be `spinal-cased`. Go with the grain of the language.

Never mix case unless there is absolutely no other choice. Mixing case makes the developer experience worse because then your mind has to juggle "is this a function? a variable? a constant?".

In addition to language conventions, follow codebase conventions. There are cases where previous developers have made deliberate decisions about naming things. For example:

- You're working on an API client that grabs data and displays it. The client is written in Javascript (typically camel cased) but the data from the API is exclusively `snake_cased`. You might make the conscious choice to use snake casing with data that comes back from the API for consistency.
- You're working on a marketing site for a large company. You might choose to follow the [BEM naming conventions][4] in order to provide a stronger convention in your CSS (BEM includes underscores in classnames instead of just dashes).

## 2. Use Whitespace

Many languages let you be liberal with whitespace (even whitespace delimited languages like Python). Before making a pull request, look at your code and see if a little spacing could make it easier to read. For example, the code that renders my "TH" top left link:

```typescript
<Button
  href={Routes.home()}
  className={classnames(styles.Brand, 'global-brand')}
  noStyling={true}
>
  TH
</Button>
```

I wouldn't say that code is bad, but depending on how wide your editor is, it could be difficult to read. Let's add a little bit of whitespace:

```typescript
<Button
  href={Routes.home()}
  className={classnames(styles.Brand, 'global-brand')}
  noStyling={true}
>
  TH
</Button>
```

When rereading both snippets, the second is easier to scan and see what props I'm passing to `Button`.

## 3. Name and then Rename

I have found that by the time I finish writing a piece of code, the variable and function names I initially started with no longer accurately describe what is happening in the code. So before comitting any new changes to master, revisit your variable and function names and ask yourself:

- Has the purpose of this variable/function changed since I originally started writing it?
- If I were reading this code for the first time, would the purpose of this variable/function be obvious?

If you decide that a variable or function needs to be renamed, always choose clarity over brevity. `Tickets` might be shorter, but `NewTicketsWithoutAnId` will make your code easier to understand.

## Conclusion

None of these tips are groundbreaking, but it's surprising how these simple practices can really make a big impact on the readability and maintainability of the code you write.

[1]: https://www.python.org/dev/peps/pep-0008/#function-and-variable-names
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[3]: https://medium.freecodecamp.org/css-naming-conventions-that-will-save-you-hours-of-debugging-35cea737d849
[4]: http://getbem.com/introduction/
