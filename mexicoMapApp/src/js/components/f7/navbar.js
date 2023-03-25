/**
 * Created by 1 on 05.12.2015.
 */
import React from "react";
const { Component } = React;

export default class NavBar extends Component {
  render() {
    return (
        <div className={`navbar-inner ${this.props.classList}`} data-page={this.props.page}>
          {this.props.children}
        </div>
    );
  }
}

NavBar.propTypes = {
  classList: React.PropTypes.string
};
NavBar.defaultProps = {
  classList: ""
};
