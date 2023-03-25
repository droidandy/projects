import * as Router from "@Core/app/router";

export default function(url) {
  return Router.goTo(url, false);
}
