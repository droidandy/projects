import fs from "fs";

const options = {
  // path to folder in which the file will be created
  path: "./dist/snippets/",
  // file name
  fileName: `_js_entry.liquid`,
};

const clearFile = () => {
  fs.truncate(options.path + options.fileName, 0, () => {
    console.log("cleared file " + options.fileName);
  });
};

const appendEntry = (content) => {
  fs.appendFile(options.path + options.fileName, content, function(err) {
    if (err) throw err;
    console.log("added " + content);
  });
};

const generateCSSEntry = (fileName) => {
  return ` {{ '${fileName}' | asset_url | stylesheet_tag }}`;
};

const generateJSEntry = (fileName) => {
  return ` {{ '${fileName}' | asset_url | script_tag }}`;
};

const findCssFileInTheDirectory = () => {
  const dir = "./dist/assets";
  const filter = /\.css$/i;
  const files = fs.readdirSync(dir).filter((f) => f.match(filter));

  if (files.length == 0) throw Error("no matching");

  files.map(generateCSSEntry).forEach(appendEntry);
};

const findJsFiles = () => {
  const dir = "./dist/assets";
  const filter = /^(entry|vendors_entry)\.\w+\.js$/gm;
  const files = fs.readdirSync(dir).filter((f) => f.match(filter));

  if (files.length == 0) throw Error("no matching");

  files.map(generateJSEntry).forEach(appendEntry);
};

clearFile();
findCssFileInTheDirectory();
findJsFiles();
