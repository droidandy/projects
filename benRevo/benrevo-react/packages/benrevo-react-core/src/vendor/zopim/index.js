/* eslint-disable */

window.$zopim || (function (d, s) {
  var z = window.$zopim = function (c) {
    z._.push(c)
  }, $ = z.s =
    d.createElement(s), e = d.getElementsByTagName(s)[0];
  z.set = function (o) {
    z.set._.push(o)
  };
  z._ = [];
  z.set._ = [];
  $.async = !0;
  $.setAttribute("charset", "utf-8");
  $.src = "https://v2.zopim.com/?51NeLmMjSQiJCOPUmwzJrbFS4urSv71m";
  z.t = +new Date;
  $.type = "text/javascript";
  if (e) e.parentNode.insertBefore($, e)
})(document, "script");
