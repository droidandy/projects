import { fetchArticles } from "..";
import fs from "fs";

const updateFile = (objectForFile) => {
  const options = {
    // path to folder in which the file will be created
    path: __dirname + "/",
    // file name
    fileName: "articles.list.js",
    // content of the file
    content: `module.exports = ${JSON.stringify(objectForFile, null, 2)}`,
  };

  return fs.writeFile(
    options.path + options.fileName,
    options.content,
    function(err) {
      if (err) throw err;
      console.log("file is updated successfully", options.fileName);
    }
  );
};

export const updateCache = async () => {
  return fetchArticles().then(updateFile);
};

export const loadCache = async () => {
  const data = await import("./articles.list.js");
  return data;
};
