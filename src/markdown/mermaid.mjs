// Two small shims around @xingwangzhe/satteri-mermaid (Merman renderer) so diagrams look like the old Gatsby SVGs.

// 1. Mermaid.js turns a literal "\n" inside a label into a line break; Merman prints it as text.
//    Run this BEFORE mermaidMdast() so the fence it captures already has <br/>.
export function mermaidNewlines() {
  return {
    name: 'mermaid-newlines',
    code(node, ctx) {
      if (node.lang !== 'mermaid' || !node.value.includes('\\n')) return;
      ctx.setProperty?.(node, 'value', node.value.replaceAll('\\n', '<br/>'));
    },
  };
}

// 2. Old markup was <div class="Mermaid"><svg/></div>; src/styles/Mermaid.scss targets `.Mermaid`.
//    Run this AFTER mermaidHast().
export function mermaidWrapperClass() {
  return {
    name: 'mermaid-wrapper-class',
    element: {
      filter: ['div'],
      visit(node, ctx) {
        if (
          node.properties?.dataMermaidSsg === undefined &&
          node.properties?.['data-mermaid-ssg'] === undefined
        )
          return;
        ctx.setProperty(node, 'className', ['mermaid', 'Mermaid']);
        // It brings `max-width:100%;overflow:hidden`, which stops the box from
        // breaking out into the margins like the old one did (see Mermaid.scss).
        ctx.setProperty(node, 'style', null);
      },
    },
  };
}

// 3. Fences tagged `mermaid-code` show the diagram's source instead of drawing it
//    (displaying-mermaid-charts-in-gatsby). Run this AFTER mermaidMdast(), which
//    skips them, so they end up as ordinary `mermaid` code blocks for Prism.
export function mermaidCodeFences() {
  return {
    name: 'mermaid-code-fences',
    code(node, ctx) {
      if (node.lang !== 'mermaid-code') return;
      ctx.setProperty(node, 'lang', 'mermaid');
    },
  };
}
