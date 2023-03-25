import * as Router from "@Core/app/router";

export default (email) => {
  return Router.goToAccountRegistration(email);
};
