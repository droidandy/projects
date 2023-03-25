import * as Products from "../src/scripts/core/api/shopify.storefront/products";
import fs from "fs";
import fetch from "cross-fetch";

global.fetch = fetch;

const updateFile = (objectForFile) => {
  const options = {
    // path to folder in which the file will be created
    path: "./src/scripts/core/api/shopify.storefront/products/cache/",
    // file name
    fileName: "products.list.js",
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

Products.fetch().then(updateFile);
