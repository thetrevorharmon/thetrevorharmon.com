---
title: 'Connecting ANTLR to CodeMirror 6: Getting ANTLR and CodeMirror talking'
slug: connecting-antlr-to-codemirror-6-getting-antlr-and-codemirror-talking
date: 2023-05-24
type: Post
status: Draft
description: Connect ANTLR to CodeMirror via a ParseAdapter
---

In the previous article in this series, I described how to create a language server for my toy language “Zephyr” using the ANTLR framework. In this article, we’ll connect that language server to CodeMirror 6.

_Note: Unsure what ANTLR, Zephyr, or CodeMirror 6 are? Here’s the first article in the series describing each of these concepts._

- We now have a functioning language server which can take in a zephyr document and return a stream of tokens for that document
- We need to transform those tokens into something that codemirror understands

At a high level, we will need to:

1. Tokenize the document
2. Transform those tokens into NodeTypes
3. Place those nodeTypes into a buffer
4. Build a tree from the buffer

We’ve already covered the first point in the previous article in this document; we’ll cover the rest in this article.

## What are NodeTypes?

- CodeMirror’s parsing engine Lezer manages a parse tree of the document
- It describes each node of that tree using the NodeType class
- A NodeType is not a node directly, but a description of the Node.
- A nodeType contains (at minimum) an id, but often also contains a name.

The docs state:

> Different node types with the same name within a node set should play the same semantic role.

- A NodeSet is a collection of NodeTypes
- We pass Lezer a NodeSet when we want to construct a tree
- It uses the nodeset as a lookup table when we pass a NodeType id to Lezer
- Before we can construct a tree, we need to create a mapping between our tokens and NodeTypes
- I have found it’s easiest to simply use the same names between the token names and the NodeType names. Let’s go ahead and set up that mapping (here are the supported tokens, for reference).

We have defined these types of tokens previously:

```typescript
const supportedTokens = [
  'const',
  'let',
  'semicolon',
  'assign',
  'blockComment',
  'lineComment',
  'number',
  'string',
  'identifier',
  'unknown',
] as const;

export type Token = (typeof supportedTokens)[number];
```

Let’s now define nodeTypes that map to Token type:

```typescript
import {NodeType} from '@lezer/common';

export const tokenToNodeType: {[key in Token | 'topNode']: NodeType} = {
  topNode: NodeType.define({id: 0, name: 'topNode', top: true}),
  const: NodeType.define({id: 1, name: 'const'}),
  let: NodeType.define({id: 2, name: 'let'}),
  semicolon: NodeType.define({id: 3, name: 'semicolon'}),
  assign: NodeType.define({id: 4, name: 'assign'}),
  number: NodeType.define({id: 5, name: 'number'}),
  string: NodeType.define({id: 6, name: 'string'}),
  identifier: NodeType.define({id: 7, name: 'identifier'}),
  unknown: NodeType.define({id: 8, name: 'unknown'}),
  blockComment: NodeType.define({id: 9, name: 'blockComment'}),
  lineComment: NodeType.define({id: 10, name: 'lineComment'}),
};
```

- You may notice that there is one extra type we have added called topNode. This node type is a special type that is used explicitly as the top of the tree that Lezer will build for us. It doesn’t hold any semantic meaning but is the node we connect everything to, in order to have the tree have a single entrypoint
- Once we have a mapping between our tokens and NodeTypes, we can use that to build a NodeSet as well

```typescript
import {NodeSet} from '@lezer/common';

export const parserAdapterNodeSet = new NodeSet(Object.values(tokenToNodeType));
```

- I’ve found it useful to manage the NodeTypes this way because it becomes straightforward to add a new NodeType–simply add an entry to the tokenToNodeType map
- Now that we have NodeTypes in a NodeSet setup, we can look at building the connecting piece between the Language Server and Lezer’s Parser

## Creating a Parser Adapter

Lezer has a Parser class that we can utilize to connect our language server to Lezer. The class defines several functions that Lezer will call to generate a parse tree–`createParse`, `startParse`, and `parse`. We can utilize these functions and provide our own implementation that reads the document and generates a tree based off of our own language server. Let’s first start by declaring the class:

```typescript
import {Parser} from '@lezer/common';
import {LanguageServer} from './language';
import {tokenToNodeType} from './constants';

export class ParserAdapter extends Parser {
  private languageServer = new LanguageServer();

  private getNodeTypeIdForTokenIndex(index: number) {
    const tokenType = this.languageServer.getTokenTypeForIndex(index);
    return tokenToNodeType[tokenType].id;
  }
}
```

At this point, we’ve instantiated a new language server, and created a private method that makes it easy to derive the node type from the token’s index. We’ll use this later when constructing the tree.

## Lezer Trees & Buffers

At this point, let’s look more closely at Lezer trees. Lezer’s Tree class has a static build method that we can use to build our own tree. We can provide it with either a BufferCursor or just an array of integers that correspond to the shape of the tree. When we provide it with a buffer of integers, the integers are chunked by 4, and each chunk corresponds to a node. Here’s what each position in the chunk means:

1. The node type id for the node. This id must be part of the NodeSet we will (eventually) pass into the Tree’s build function.
2. The start offset of the node from the top of the document.
3. The end offset of the node from the top of the document.
4. The number of integers taken up by this node in the array. The smallest value this can be is four, which corresponds to the integers for the node type, start offset, end offset, and the size. When this node is a parent node of child nodes, this number reflects the total number of “slots” in the array that both the parent and children take up.

As a practical example, let’s say that we have two token Zephyr query:

```javascript
const hello
```

If we were to construct a tree for this query, we would need:

- A node for `const`
- A node for `hello`
- A top node that acts as the parent for the previous two nodes

The buffer for this query might look like:

```typescript
// each node follows the grouping
// id, start, end, size
const buffer = [
  // const
  2, 0, 5, 4,
  // hello
  3, 6, 11, 4,
  // top node
  1, 0, 11, 12,
];
```

The start and end offsets for the first two tokens correspond to the top of the document, and each has the typical size of 4. However, the top node has a start offset of 0 and an end offset of 11. Because it’s the parent of both of the previous nodes, it needs to encompass both of those nodes’ offsets. Additionally, the size of the top node is 12–4 for the first node, 4 for the second node, and 4 for itself (making 12 in total).

In order to build a tree in our ParserAdapter class, we’ll need to create a buffer that describes the tree. We can use the tokens that come back from the language server as the basis for this buffer, since it has most of the pieces we need. Let’s add a helper method to our class to transform the token stream into a buffer that Lezer can understand:

```typescript
const DEFAULT_NODE_GROUP_SIZE = 4;

private createBufferFromTokens(tokens: Token[]) {
  const buffer = [];

  // 1
  tokens.forEach((token) => {
    const nodeTypeId = this.getNodeTypeIdForTokenType(token.type);
    const startOffset = token.startIndex;
    // 2
    const endOffset = token.stopIndex + 1;

    buffer.push(
      nodeTypeId,
      startOffset,
      endOffset,
      // 3
      DEFAULT_NODE_GROUP_SIZE,
    );
  });

  const topNodeId = tokenToNodeType.topNode.id;
  const startOffset = tokens[0].startIndex;
  const endOffest = tokens[tokens.length - 1].stopIndex;
  // 4
  const topNodeSize =
    tokens.length * DEFAULT_NODE_GROUP_SIZE + DEFAULT_NODE_GROUP_SIZE;

  buffer.push(topNodeId, startOffset, endOffest, topNodeSize);

  return buffer;
}
```

Here’s what’s happening in this function:

1. We’re iterating over each token and pushing it into the buffer.
2. We add one to the endOffset because of the way offsets are computed between ANTLR and Lezer. ANTLR’s endOffset refers to the index of the last character of the word; Lezer expects the end offset to be fully inclusive of the word (and so the offset should refer to the character just past the word).
3. DEFAULT_NODE_GROUP_SIZE is a named constant to make having 4 in the code a little less ✨ magic-number-y ✨.
4. We compute the top node size based on the number of children (tokens.length \* DEFAULT_NODE_GROUP_SIZE) plus the size of the top node itself.

The docs specify that a node buffer must be in postfix order–children come before parents, and children are ordered by offsets. If you have offsets out of order, Lezer won’t generate the tree properly and will throw an error.

```typescript
// this won't work
const invalidBuffer = [
  [nodeId, 0, 4, size],
  [nodeId, 8, 12, size],
  [nodeId, 5, 6, size],
  [parentId, 0, 12, size],
];

// this works
const validBuffer = [
  [nodeId, 0, 4, size],
  [nodeId, 5, 6, size],
  [nodeId, 8, 12, size],
  [parentId, 0, 12, size],
];
```

In this example the Language Server returns the tokens in the order they appear in the document, which means that we can always assume that they are in the correct order.

## Building a Tree

Now that we have constructed a buffer, let’s build a tree! We’ll add a helper method for generating a tree:

```typescript
private buildTree(document: string) {
  // 1
  const tokens = this.languageServer.getTokenStream(document);

  // 2
  if (tokens.length < 1) {
    return Tree.build({
      buffer: [
        tokenToNodeType.topNode.id,
        0,
        document.length,
        DEFAULT_NODE_GROUP_SIZE,
      ],
      nodeSet: parserAdapterNodeSet,
      topID: tokenToNodeType.topNode.id,
    });
  }

  // 3
  const buffer = this.createBufferFromTokens(tokens);

  // 4
  return Tree.build({
    buffer: buffer,
    nodeSet: parserAdapterNodeSet,
    topID: tokenToNodeType.topNode.id,
  });
}
```

What’s happening in this code:

1. We first get a list of tokens in the document from the language server.
2. If the language server returns an empty list, we can build a “dummy” tree with only a single node (a top node) in it. This ensures that we still return a tree and it doesn’t throw an error.
3. If we know we have tokens, we generate a buffer from that array of tokens.
4. From there, we build our tree! Notice that we need to pass in the node set we construct earlier, as well as the id of the top node. If either of those are omitted or incorrect, the tree won’t build properly.

## Completing the adapter

Now that we have all of our helper methods, we are ready to finish the ParserAdapter by implementing the required methods. We’ll implement both startParse and createParse:

```typescript
// 1
createParse(
  input: Input,
  fragments: readonly TreeFragment[],
  ranges: readonly { from: number; to: number }[]
): PartialParse {
  return this.startParse(input, fragments, ranges);
}

startParse(
  input: string | Input,
  \_0?: readonly TreeFragment[] | undefined,
  \_1?: readonly { from: number; to: number }[] | undefined
): PartialParse {
  // 2
  const document =
    typeof input === "string" ? input : input.read(0, input.length);

  // 3
  const tree = this.buildTree(document);

  // 4
  return {
    stoppedAt: input.length,
    parsedPos: input.length,
    stopAt: (_) => {},
    advance: () => tree,
  };
}
```

Here’s what’s happening in this code:

1. Instead of maining a separate implementation for createParse, I’ve opted to simply forward calls to that function to startParse.
2. Lezer uses an Input type in addition to a simple string type; we need to do a little bit of unwrapping to get at the document.
3. We use the document to generate a tree.
4. We return an object that conforms to the expected return shape. While Lezer supports incremental parsing, this implementation doesn’t consider incremental parsing, which is why the implementation of this return object is not very meaningful.

If we put all of this together, we end up with the following ParserAdapter:

```ts
import { Parser, Tree, Input, PartialParse, TreeFragment } from "@lezer/common";
import { Token } from "antlr4ts";
import { LanguageServer } from "./language";
import { parserAdapterNodeSet, tokenToNodeType } from "./constants";

const DEFAULT_NODE_GROUP_SIZE = 4;

export class ParserAdapter extends Parser {
  private languageServer = new LanguageServer();

  private getNodeTypeIdForTokenType(index: number) {
    const tokenType = this.languageServer.getTokenTypeForIndex(index);
    return tokenToNodeType[tokenType].id;
  }

  private createBufferFromTokens(tokens: Token[]) {
    const buffer = [];

    tokens.forEach((token) => {
      const nodeTypeId = this.getNodeTypeIdForTokenType(token.type);
      const startOffset = token.startIndex;
      const endOffset = token.stopIndex + 1;

      buffer.push(nodeTypeId, startOffset, endOffset, DEFAULT_NODE_GROUP_SIZE);
    });

    const topNodeId = tokenToNodeType.topNode.id;
    const startOffset = tokens[0].startIndex;
    const endOffest = tokens[tokens.length - 1].stopIndex;
    const topNodeSize =
      tokens.length * DEFAULT_NODE_GROUP_SIZE + DEFAULT_NODE_GROUP_SIZE;

    buffer.push(topNodeId, startOffset, endOffest, topNodeSize);

    return buffer;
  }

  private buildTree(document: string) {
    const tokens = this.languageServer.getTokenStream(document);

    if (tokens.length < 1) {
      return Tree.build({
        buffer: [
          tokenToNodeType.topNode.id,
          0,
          document.length,
          DEFAULT_NODE_GROUP_SIZE,
        ],
        nodeSet: parserAdapterNodeSet,
        topID: tokenToNodeType.topNode.id,
      });
    }

    const buffer = this.createBufferFromTokens(tokens);

    return Tree.build({
      buffer: buffer,
      nodeSet: parserAdapterNodeSet,
      topID: tokenToNodeType.topNode.id,
    });
  }

  createParse(
    input: Input,
    fragments: readonly TreeFragment[],
    ranges: readonly { from: number; to: number }[]
  ): PartialParse {
    return this.startParse(input, fragments, ranges);
  }

  startParse(
    input: string | Input,
    \_0?: readonly TreeFragment[] | undefined,
    \_1?: readonly { from: number; to: number }[] | undefined
  ): PartialParse {
    const document =
      typeof input === "string" ? input : input.read(0, input.length);

    const tree = this.buildTree(document);

    return {
      stoppedAt: input.length,
      parsedPos: input.length,
      stopAt: (_) => {},
      advance: () => tree,
    };
  }
}
```

## Considerations

This implementation isn’t perfect, and has a couple of drawbacks:

1. It doesn’t support incremental parsing. Instead of trying to parse only part of the document, this implementation basically throws away the old tree and creates a new one on every keystroke. This might be acceptable in documents that will only ever be very small, but if the document is 10000 lines long, performance will suffer.
2. It lacks a complete picture of the semantic structure. We are relying on the default token stream that comes out of ANTLR, and that token stream doesn’t provide us with a description of the semantic structure of the code–for example, we don’t know when a statement starts and stops. The token stream only provides us with information contained in the lexer, and doesn’t have a knowledge of what’s in the Parser. Ideally, a tree would be assembled in a way that includes this information.

While these issues are solvable, I’ve opted not to solve them as part of this example and instead have kept this example as simple as possible to demonstrate how to connect a language server to Lezer.