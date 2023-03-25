import React, { Component } from "react";

import Header from "@Components/Structure/Header";
import Button from "@Components/Structure/Button";
import { translate } from "@Core/i18n";
import PropTypes from "prop-types";

@translate(
  {
    guest: {
      title: "ПРОДОЛЖИТЬ БЕЗ АККАУНТА",
      button: "ПРОДОЛЖИТЬ",
    },
  },
  "Login"
)
export default class BackButton extends Component {
  render() {
    return (
      <div className="text-center">
        <hr className="hr--invisible" />
        <h2>{this.t("guest.title")}</h2>

        <input
          type="submit"
          className="btn"
          onClick={() => {
            this.props.onClick(this.props.url);
          }}
          value={this.t("guest.button")}
        />
      </div>
    );
  }
}

BackButton.propTypes = {
  onClick: PropTypes.func,
  url: PropTypes.string,
};
