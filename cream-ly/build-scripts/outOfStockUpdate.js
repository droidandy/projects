const fs = require("fs");
const fetch = require("cross-fetch");

const url = `https://us-central1-cream-ly.cloudfunctions.net/shopifyProducts-outOfStock`;

fetch(url)
  .then((res) => res.json())
  .then((inventoryConfig) => {
    const options = {
      // path to folder in which the file will be created
      path: "./src/scripts/core/products/inventory/",
      // file name
      fileName: "outOfStockConfig.js",
      // content of the file
      content: `module.exports = ${JSON.stringify(inventoryConfig, null, 2)}`,
    };

    fs.writeFile(options.path + options.fileName, options.content, function(
      err
    ) {
      if (err) throw err;
      console.log(
        "outOfStockConfig file is created successfully",
        options.content
      );
    });
  });
