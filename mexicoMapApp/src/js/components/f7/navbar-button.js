/**
 * Created by 1 on 05.12.2015.
 */
import React from "react";
const { Component } = React;

export default class NavButton extends Component {
  render() {
    return (
        <div className={this.props.side}>
          {this.props.children}
        </div>
    );
  }
}
NavButton.propTypes = {
  side: React.PropTypes.string
};
NavButton.defaultProps = {
  side: "left"
};
