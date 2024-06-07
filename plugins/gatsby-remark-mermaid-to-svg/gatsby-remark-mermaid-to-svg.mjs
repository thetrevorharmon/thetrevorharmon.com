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

export async function gatsbyRemarkMermaidToSvg(args, pluginOptions) {
  const {markdownAST, markdownNode, getNode} = args;

  const articlePath = getNode(markdownNode.parent).relativeDirectory;
  const svgDirectory = `./src/content/blog/${articlePath}/diagrams`;

  const options = Object.assign({}, defaultOptions, pluginOptions);

  visit(markdownAST, 'code', async (node) => {
    if (node == null) {
      return;
    }

    if (node.lang === 'mermaid-code') {
      node.lang = 'mermaid';
      return;
    }

    if (node.lang === 'mermaid') {
      const nodeKey = getNodeKey(node.value);

      const svgFilePath = `${svgDirectory}/${nodeKey}.svg`;

      let svg = node.value;

      if (fs.existsSync(svgFilePath)) {
        svg = fs.readFileSync(svgFilePath);
      } else if (process.env.NODE_ENV !== 'development') {
        throw new Error(
          `Unable to find mermaid chart at path ${svgFilePath}.\nYou need to generate the chart in develop mode, commit it to main, and try again.`,
        );
      } else {
        try {
          svg = generateSVGFromMermaid(node.value, options);

          if (!fs.existsSync(svgDirectory)) {
            fs.mkdirSync(svgDirectory);
          }

          fs.writeFileSync(svgFilePath, svg);

          console.log(`Wrote SVG file to ${svgFilePath}`);
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

function getNodeKey(value) {
  const contentHash = crypto.createHash('sha256').update(value).digest('hex');
  return `mermaid__${contentHash}`;
}
