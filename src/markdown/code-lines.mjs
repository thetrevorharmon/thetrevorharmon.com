// Line highlighting in code blocks, the way gatsby-remark-prismjs did it:
//   // highlight-line        (at the end of a line) highlights that line
//   // highlight-next-line   (on its own line) highlights the line below
//   // highlight-start / // highlight-end   highlight the lines between them
// The marker comments are removed, and highlighted lines are wrapped in
// <span class="gatsby-highlight-code-line"> (a block, so it has no newline
// after it). Runs after Prism has turned the code into token spans.
import {defineHastPlugin} from 'satteri';

const DIRECTIVE = /^\s*\/\/ highlight-(next-line|start|end)\s*$/;
const TRAILING = /\s*\/\/ highlight-line\s*$/;

const text = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(text).join('');

/** Splits a list of nodes into lines, closing and reopening spans that cross a newline. */
function splitLines(nodes) {
  const lines = [[]];
  for (const node of nodes) {
    if (node.type === 'text') {
      node.value.split('\n').forEach((part, i) => {
        if (i > 0) lines.push([]);
        if (part !== '') lines.at(-1).push({type: 'text', value: part});
      });
    } else if (node.type === 'element') {
      splitLines(node.children).forEach((segment, i) => {
        if (i > 0) lines.push([]);
        if (segment.length > 0) lines.at(-1).push({...node, children: segment});
      });
    } else {
      lines.at(-1).push(node);
    }
  }
  return lines;
}

/** Drops a trailing `// highlight-line` comment, and the space before it. */
function stripTrailingMarker(line) {
  let end = line.length;
  // The comment is its own token (or the tail of a text node).
  while (end > 0 && TRAILING.test(text(line[end - 1]))) end--;
  const kept = line.slice(0, end);
  if (kept.length === line.length) {
    const last = kept.at(-1);
    if (last?.type === 'text') {
      kept[kept.length - 1] = {
        ...last,
        value: last.value.replace(TRAILING, ''),
      };
    }
    return kept;
  }
  const last = kept.at(-1);
  if (last?.type === 'text') {
    const value = last.value.replace(/\s+$/, '');
    if (value === '') kept.pop();
    else kept[kept.length - 1] = {...last, value};
  }
  return kept;
}

export const codeLineHighlights = () =>
  defineHastPlugin({
    name: 'code-line-highlights',
    element: {
      filter: ['pre'],
      visit(pre) {
        const code = pre.children.find(
          (child) => child.type === 'element' && child.tagName === 'code',
        );
        if (
          code == null ||
          !/highlight-(next-line|start|end|line)/.test(text(code))
        ) {
          return;
        }

        const out = [];
        let highlightNext = false;
        let inRange = false;
        for (const line of splitLines(code.children)) {
          const content = text({type: 'element', children: line});
          const directive = content.match(DIRECTIVE)?.[1];
          if (directive === 'next-line') highlightNext = true;
          else if (directive === 'start') inRange = true;
          else if (directive === 'end') inRange = false;
          if (directive != null) continue;

          const hasTrailing = TRAILING.test(content);
          out.push({
            nodes: hasTrailing ? stripTrailingMarker(line) : line,
            highlighted: highlightNext || inRange || hasTrailing,
          });
          highlightNext = false;
        }

        const children = [];
        out.forEach(({nodes, highlighted}, i) => {
          if (highlighted) {
            children.push({
              type: 'element',
              tagName: 'span',
              properties: {className: ['gatsby-highlight-code-line']},
              children: nodes,
            });
          } else {
            children.push(...nodes);
            if (i < out.length - 1) children.push({type: 'text', value: '\n'});
          }
        });
        return {...pre, children: [{...code, children}]};
      },
    },
  });
