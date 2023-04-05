---
title: StaticQuery and Typescript
slug: staticquery-and-typescript
date: 2018-11-29T15:22-08:00
type: Post
status: Published
description: How to use Gatsby's StaticQuery while working in a Typescript environment.
image:
  source: >-
    ./MacBook-Pro-with-code-on-the-screen-sitting-on-a-wooden-table-with-two-chairs.jpg
  alt: >-
    MacBook Pro with code on the screen sitting on a wooden table with two
    chairs
  attribution:
    author: Jantine Doornbos
    sourceName: Unsplash
    sourceUrl: https://unsplash.com/photos/HvYy5SEefC8
---

I was recently working on [my portfolio site](https://thetrevorharmon.com 'Portfolio site of Trevor Harmon'), and I wanted to easily pull in the site title with a graphQL query. After a bunch of trial and error, I ended up using `StaticQuery` to get the data and created a wrapper around `react-helmet` to make setting the title easy. However, I wasn’t able to find any great resources for this in Typescript––here’s how to do all of this with Typescript.

_Update: Gatsby recently added a React hook to do this with less code. [Scroll to the bottom](#update) to see how to use the hook._

## An Introduction to StaticQuery

As part of my search for information on this, I came across some excellent documentation on using StaticQuery in [Gatsby’s docs](https://www.gatsbyjs.org/docs/static-query/ "Gatsby's documentation on StaticQuery") (worth a read if you want more background). The initial code sample they provided was this:

```javascript
import React from 'react';
import {StaticQuery, graphql} from 'gatsby';
export default () => (
  <StaticQuery
    query={graphql`
      query HeadingQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={(data) => (
      <header>
        <h1>{data.site.siteMetadata.title}</h1>
      </header>
    )}
  />
);
```

This code:

1. Declares a StaticQuery object and a graphQL query for what it’s looking for
2. Exposes and object called data
3. Passes data along to its render function, which then consumes the data in some way

Then the author gets us a little bit closer with `propTypes`:

```javascript
import React from 'react';
import {StaticQuery, graphql} from 'gatsby';
import PropTypes from 'prop-types';
const Header = ({data}) => (
  <header>
    <h1>{data.site.siteMetadata.title}</h1>
  </header>
);
export default (props) => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={(data) => <Header data={data} {...props} />}
  />
);
Header.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
```

Now the code has a better separation of concerns, which allows us to add `propTypes` to our Header object.

## What about with Typescript?

Let’s re-write this to use Typescript, and also add a `className` prop that we can pass through to our title. First, our imports:

```javascript
import {graphql, StaticQuery} from 'gatsby';
import * as React from 'react';
```

Next, we’ll define two interfaces: one for props we want to pass into this component, and one for the data. We’re going to extend the first interface (`HeaderProps`) in our second interface (`HeaderPropsWithData`), so that we have a comprehensive representation of our props types:

```javascript
interface HeaderProps {
  className: string;
}
interface HeaderPropsWithData extends HeaderProps {
  data: {
    site: {
      siteMetadata: {
        title: string,
      },
    },
  };
}
```

Now that we have an interface, let’s use it in our `Header` component. I’m using a stateless functional component here, but you could use a regular component, too. We’re extending the `HeaderPropsWithData` so that we have type definitions for both user-defined and graphQL-provided props.

```javascript
const Header: React.SFC<HeaderPropsWithData> = ({className, data}) => {
  return (
    <header>
      <h1 className={className}>{data.site.siteMetadata.title}</h1>
    </header>
  );
};
```

Now that we have our `Header` function defined, let’s declare our export and our `StaticQuery`:

```javascript
export default (props: HeaderProps) => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    // tslint:disable-next-line jsx-no-lambda
    render={(data) => <Header data={data} {...props} />}
  />
);
```

I’m using `HeaderProps` as the type definition for `props`, which allows us to define things that the user can pass to this function (like `className`). We wouldn’t want to use `HeaderPropsWithData` because it would throw an error about missing the data object.

I’m also disabling TSLint because TSLint doesn’t like it when we pass a lambda to a render function. This can [result in performance issues](https://github.com/wmonk/create-react-app-typescript/issues/370 'Information about issues caused by passing a lambda'), but because this is using Gatsby and it is generating a static site for us, we can just ignore that error here.

## The finished code

If you’re just looking for the finished code, I decided to stick it in a [Github gist](https://gist.github.com/thetrevorharmon/e03f5d156660fe46da1605d9a76748f1). And if you happen to have the _exact_ use case as me, you’re welcome to look at [the wrapper class I created](https://gist.github.com/thetrevorharmon/14596f8f890d9782f392dced16db148f) for `react-helmet`.

<a name="update"></a>

## Update: The useStaticQuery Hook

Since the time I originally wrote this, Gatsby released a React hook that simplifies using StaticQuery. Here's the same example from before, but rewritten using the new `useStaticQuery` hook.

```javascript
// 1
import {graphql, useStaticQuery} from 'gatsby';
import * as React from 'react';

interface HeaderProps {
  className: string;
}

// 2
interface HeaderData {
  site: {
    siteMetadata: {
      title: string,
    },
  };
}

// 3
const Header: React.SFC<HeaderProps> = ({className}) => {
  // 4
  const data: HeaderData = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <header>
      <h1 className={className}>{data.site.siteMetadata.title}</h1>
    </header>
  );
};

// 5
export default Header;
```

Here are the changes from the original version:

1. This imports `useStaticQuery` instead of `StaticQuery`.
2. Instead of inheriting the previous interface, this creates a separate interface for the data.
3. The `Header` function directly uses `HeaderProps`as its interface.
4. The `data` object is declared and uses `HeaderData` as its interface. The output of the `useStaticQuery` hook (with the graphql statement) is then assigned to the `data` object.
5. Instead of exporting `StaticQuery` within an anonymous function, I can directly export the `Header` component.

Using the hook makes static queries within components cleaner and easier to follow.
