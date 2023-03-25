/**
 * Created by developercomputer on 27.10.15.
 */
const words = require("./../../words");

module.exports = [
  {
    name: words.menu_video[LN],
    iconClass: "icon icon-video",
    href: "#videoTutorials-themes"
  },
  {
    name: words.menu_gallery[LN],
    iconClass: "icon icon-photo",
    href: "#photoGallery-albums"
  },
  {
    name: words.menu_materials[LN],
    iconClass: "icon icon-materials",
    href: "#materials"
  },
  {
    name: words.menu_books[LN],
    iconClass: "icon icon-books",
    href: "#books"
  },
  {
    name: words.menu_courses[LN],
    iconClass: "icon icon-courses",
    href: "#courses"
  },
  {
    name: words.menu_blog[LN],
    iconClass: "icon icon-blog",
    href: "#blog"
  },
  {
    name: words.menu_fanart[LN],
    iconClass: "icon icon-fan-art",
    href: "#fan-art"
  },
  {
    name: words.menu_leo[LN],
    iconClass: "icon icon-about",
    href: "#about"
  },
  {
    name: words.menu_subscribe[LN],
    iconClass: "icon icon-mail",
    href: "#subscribe"
  },
  {
    name: words.menu_other[LN],
    iconClass: "icon icon-more",
    href: "#other"
  },
  {
    name: words.menu_vip[LN],
    iconClass: "icon icon-vip",
    href: window.FREE ? "#" : "#vip-zone",
    free: window.FREE
  }
];