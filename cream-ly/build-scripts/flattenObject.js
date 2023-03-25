function flattenObject(ob) {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == "object" && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

const writeFile = (content) => {
  const fs = require("fs");

  const options = {
    // path to folder in which the file will be created
    path: ".",
    // file name
    fileName: "lv_flat.js",
    // content of the file
    content: JSON.stringify(content),
  };

  fs.writeFile(options.path + options.fileName, options.content, function(err) {
    if (err) throw err;
    console.log("build file is created successfully", options.content);
  });
};

const products = require("../src/locales/lv.json");
const flat = flattenObject(products);
writeFile(flat);
