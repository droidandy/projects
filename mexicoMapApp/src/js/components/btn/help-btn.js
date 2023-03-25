/**
 * Created by developercomputer on 28.01.16.
 */
import React, { Component } from "react";

import Button from "./btn.js";

import { f7, mainView } from "./../../f7init.js";

class HelpButton extends Component {

  handleBack() {
    const { type } = this.props;
    f7.alert("Help",
        `<img src="img/win.svg" height="150">`);
  }

  render() {
    const { classList, children } = this.props;
    return (
        <Button
            classList={classList}
            onClick={this.handleBack.bind(this)}>
          {children}
        </Button>
    );
  }
}

export default HelpButton;
