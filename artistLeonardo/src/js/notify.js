/**
 * Created by developercomputer on 01.12.15.
 */
const Youtube = require("./api/youtube");

module.exports = () => {
  //const moment = require("moment");
  var start = new Date(new Date().getTime() + 5*1000);
  cordova.plugins.notification.local.schedule({
    id: 1,
    title: "New video",
    text: "Every tuesday",
    firstAt: start,
    every: "week"
  });
  console.log("notify!");
};
