import * as Router from "@Core/app/router";

export default async ({ checkoutId }) => {
  Router.goToWebPayForm(checkoutId);
};
