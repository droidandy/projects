import React, { Component } from "react";
import "./index.scss";
import LoadingIndicator from "@Components/Structure/LoadingIndicator";

class CheckoutButtons extends React.Component {
  render() {
    let buttons = [];

    const isOneButtonHidden =
      this.props.isNextButtonHidden || this.props.isBackButtonHidden;

    if (!this.props.isBackButtonHidden) {
      buttons.push(
        <div className="back col-md-4 col-12" key="back">
          <button
            type="button"
            className="btn btn--secondary"
            data-test="button-step-back"
            onClick={() => this.props.onClick(this.props.backStepKey, false)}
          >
            {this.props.textBackButton}
          </button>
        </div>
      );
    }
    if (!this.props.isNextButtonHidden) {
      buttons.push(
        <div className="next col-md-8 col-12" key="next">
          <button
            type="button"
            className="btn"
            data-test="button-step-forward"
            onClick={() => this.props.onClick(this.props.nextStepKey, true)}
          >
            {this.props.textNextButton}
          </button>
        </div>
      );
    }

    return (
      <div
        key="buttons"
        className={
          "CheckoutButtons buttons row " +
          (isOneButtonHidden ? " oneButton" : "")
        }
      >
        {this.props.isLoading ? <LoadingIndicator /> : buttons}
      </div>
    );
  }
}

CheckoutButtons.defaultProps = {
  textBackButton: "back",
  textNextButton: "next",
  isLoading: false,
};

export default CheckoutButtons;
