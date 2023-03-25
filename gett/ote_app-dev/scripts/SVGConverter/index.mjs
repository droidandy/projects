import fs from 'fs';
import path from 'path';
import glob from 'glob';
import svgr from '@svgr/core';
import _ from 'lodash';

const params = {
  additionalPath: 'scripts/SVGConverter',
  output: 'output',
  dir: 'input',
  file: ''
};

params.dir = path.resolve(process.cwd(), params.additionalPath, params.dir);

const args = process.argv.slice(2);

const template = ({ template }, opts, param) => {
  const { imports, componentName, props, jsx, exports } = param;
  return template.ast`${imports}
const ${componentName} = ({ color, ...${props} }) => ${jsx}
${exports}`;
};

const generate = (icon) => {
  const load = fs.readFileSync(icon, 'utf8');
  const fileName = _.camelCase(path.parse(icon).name);
  const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

  svgr.default(
    load,
    {
      icon: true,
      native: true,
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
      template
    },
    {
      componentName,
      filePath: params.file
    }
  ).then((jsCode) => {
    const outputDir = path.resolve(process.cwd(), params.additionalPath, params.output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const file = path.resolve(outputDir, `${fileName}.js`);

    fs.writeFile(file, jsCode, (error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(`Something went wrong when creating the file: ${error}`);
      } else {
        // eslint-disable-next-line no-console
        console.log(`${file} was created`);
      }
    });
  });
};

args.forEach((arg, i) => {
  switch (arg) {
    case '-o':
      params.output = path.resolve(process.cwd(), params.additionalPath, args[i + 1]);
      break;
    case '-f':
      params.file = path.resolve(process.cwd(), params.additionalPath, args[i + 1]);
      break;
    case '-d':
      params.dir = path.resolve(process.cwd(), params.additionalPath, args[i + 1]);
      break;
    default:
      break;
  }
});

if (params.dir) {
  glob(`${params.dir}/*.svg`, (err, icons) => {
    if (err) {
      console.error(err);
    } else {
      icons.map(generate);
    }
  });
} else if (params.file) {
  generate(params.file);
} else {
  console.log('Setup path to directory or file name');
}
