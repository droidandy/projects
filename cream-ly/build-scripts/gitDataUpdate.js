const fs = require("fs");
const options = {
  // path to folder in which the file will be created
  path: "./src/scripts/",
  // file name
  fileName: "build_config.js",
  // content of the file
  content: `module.exports = {
        production: ${process.env.GIT_BRANCH === "master" ? true : false},
        git: {
          hash: "${process.env.GIT_SHA}",
          branch: "${process.env.GIT_BRANCH}",
        },
      }`,
};

fs.writeFile(options.path + options.fileName, options.content, function(err) {
  if (err) throw err;
  console.log("build file is created successfully", options.content);
});
