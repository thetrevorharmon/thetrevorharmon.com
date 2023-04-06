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

  private createBufferForTokens(tokens: Token[]) {
    return tokens.map((token) => {
      const nodeTypeId = this.getNodeTypeIdForTokenType(token.type);
      const startOffset = token.startIndex;
      // Adding 1 to include the character that lies to the right of the stopIndex (which is included in the word)
      const endOffset = token.stopIndex + 1;

      return [nodeTypeId, startOffset, endOffset, DEFAULT_NODE_GROUP_SIZE];
    });
  }

  private addTopNodeToBuffer(buffer: number[][], document: string) {
    const id = tokenToNodeType.topNode.id;
    const startOffset = 0;
    const endOffset = document.length;
    const totalBufferLength = buffer.length * DEFAULT_NODE_GROUP_SIZE;

    buffer.push([
      id,
      startOffset,
      endOffset,
      totalBufferLength + DEFAULT_NODE_GROUP_SIZE,
    ]);
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

    const buffer = this.createBufferForTokens(tokens);
    this.addTopNodeToBuffer(buffer, document);

    return Tree.build({
      buffer: buffer.flat(),
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
    _0?: readonly TreeFragment[] | undefined,
    _1?: readonly { from: number; to: number }[] | undefined
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
