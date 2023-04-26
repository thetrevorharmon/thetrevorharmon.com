import fs from 'fs';
import {execSync} from 'child_process';
import {v4 as uuidv4} from 'uuid';
import {visit} from 'unist-util-visit';
import crypto from 'crypto';

const defaultOptions = {
  wrapperClassName: 'Mermaid',
  shouldRemoveDefaultStyling: true,
  backgroundColor: 'transparent',
  mermaidOptions: {
    theme: 'base',
    flowchart: {
      useMaxWidth: true,
    },
    themeVariables: {
      fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    },
  },
};

export async function gatsbyRemarkMermaidToSvg(
  {markdownAST, markdownNode, cache},
  pluginOptions,
) {
  const options = Object.assign({}, defaultOptions, pluginOptions);

  visit(markdownAST, 'code', async (node) => {
    if (node && node.lang === 'mermaid') {
      const nodeKey = getNodeKey(node, markdownNode);
      const cachedValue = await cache.get(nodeKey);

      let svg = node.value;

      if (cachedValue) {
        svg = JSON.parse(cachedValue).svg;
      } else {
        try {
          svg = generateSVGFromMermaid(node.value, options);
        } catch {
          console.error(
            'Could not convert mermaid to svg with value:',
            node.value,
          );
        }
      }

      node.type = 'html';
      node.lang = undefined;
      node.value = `<div class=${options.wrapperClassName}>${svg}</div>`;

      if (svg && svg !== node.value) {
        await cache.set(nodeKey, JSON.stringify({svg}));
      }
    }
  });

  return markdownAST;
}

function generateSVGFromMermaid(mermaidText, options) {
  // Generate a unique filename for the temp file
  const tempFilename = `${uuidv4()}.mmd`;

  fs.writeFileSync(
    `/tmp/${tempFilename}.json`,
    JSON.stringify(options.mermaidOptions, undefined, 2),
  );

  // Write the mermaid text to a temp file
  fs.writeFileSync(`/tmp/${tempFilename}`, mermaidText);

  const command = [
    `./node_modules/.bin/mmdc`,
    `-i /tmp/${tempFilename}`,
    `-o /tmp/${tempFilename}.svg`,
    `--backgroundColor ${options.backgroundColor}`,
    `--configFile /tmp/${tempFilename}.json`,
  ].join(' ');

  // Convert the mermaid text to an SVG using mermaid-cli
  execSync(command);

  // Read the SVG file into a string
  const svgString = fs.readFileSync(`/tmp/${tempFilename}.svg`).toString();

  // Clean up the temp files
  fs.unlinkSync(`/tmp/${tempFilename}`);
  fs.unlinkSync(`/tmp/${tempFilename}.svg`);
  fs.unlinkSync(`/tmp/${tempFilename}.json`);

  if (options.shouldRemoveDefaultStyling) {
    const svgStringWithoutStyle = svgString.replace(
      /(<style>[\s\S]+<\/style>)/,
      '',
    );

    return svgStringWithoutStyle;
  }

  return svgString;
}

function getNodeKey(node, markdownNode) {
  const contentHash = crypto
    .createHash('sha256')
    .update(node.value)
    .digest('hex');
  return `${markdownNode.frontmatter.slug}__Mermaid__${contentHash}`;
}
