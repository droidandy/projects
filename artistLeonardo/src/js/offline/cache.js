/**
 * Created by developercomputer on 18.11.15.
 */
var DownloadFile = require("./download");

function cache(ls_key, data, fileNamePrefix) {
  const folderName = "cache";
  var promises = data.map((item, i) => {
    return new Promise((resolve, reject) => {
      DownloadFile(item.cacheURL, folderName, `${fileNamePrefix}${i}`, nativeURL => resolve(nativeURL));
    });
  });
  Promise.all(promises)
  .then(
      results => {
        var newData = data.slice();
        newData.forEach((item, i) => {
          item.cacheURL = results[i];
        });
        console.log(newData);
        localStorage.setItem(ls_key, JSON.stringify(newData));
      }
  );
}

module.exports = cache;
