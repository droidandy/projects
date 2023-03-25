/**
 * Created by developercomputer on 22.11.15.
 */
module.exports = {
  app_id_AD: "vcWiuCWeYXVfcMucXybuVHrUbZRzKCt6IJkuogkP",
  js_key_AD: "NJsMuRKJKOp9FFQmJe2wVjZMFXOjer1fmo4pACr9",
  app_id_FAT: "z33BU3tmRFQiC8zUHYx0xoV7H5qhNcqW7sJ1uNsP",
  js_key_FAT: "xqL0zv9wtSEarclh3DU5kcHpj1xa5kbDCH1RtEHB",
  init(ln) {
    let app_id, js_key;
    switch (ln) {
      case "en":
        app_id = this.app_id_FAT;
        js_key = this.js_key_FAT;
        break;
      case "es":
        app_id = this.app_id_AD;
        js_key = this.js_key_AD;
        break;
      default:
        app_id = this.app_id_AD;
        js_key = this.js_key_AD;
        break;
    }
    try {
      Parse.initialize(app_id, js_key);
    } catch(e) {
      console.log("Parse was not initialized: " + e);
    }
  }
};
