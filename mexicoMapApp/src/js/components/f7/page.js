/**
 * Created by 1 on 05.12.2015.
 */
import React from "react";
const { Component } = React;

export default class Page extends Component {
  render() {
    return (
        <div data-page={this.props.page} className={`page ${this.props.classList}`}>
          <div className={`page-content ${this.props.contentClasses.join(" ")}`}>
            {this.props.children}
          </div>
        </div>
    );
  }
}

Page.propTypes = {
  classList: React.PropTypes.string,
  contentClasses: React.PropTypes.array
};
Page.defaultProps = {
  classList: "",
  contentClasses: []
};
