/**
 * Created by developercomputer on 08.12.15.
 */
module.exports = (lang) => {
  let words = require("./words");
  let forTranslation = document.querySelectorAll(".translate");
  for(let i = 0, len = forTranslation.length; i < len; i++) {
    let el = forTranslation[i];
    const { word } = el.dataset;
    try {
      el.innerText = words[word][lang];
    } catch(e) {
    }
  }
};