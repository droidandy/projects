import React from "react";
import LoadingIndicator from "../LoadingIndicator";
import PropTypes from "prop-types";

import * as Router from "@Core/app/router";

// moved to theme.scss due to webpack bug
// import "./index.scss";

export default class Button extends React.Component {
  handleOnClick(event) {
    if (this.props.disabled) return;
    if (this.props.isLoading) return;
    if (typeof this.props.onClick === "function") this.props.onClick(event);
  }

  getHref() {
    if (this.props.href) return this.props.href;

    if (this.props.pageType) {
      const pageOptions =
        typeof this.props.pageOptions === "object" &&
        this.props.pageOptions != null
          ? this.props.pageOptions
          : this.props;

      return Router.getURLForPage(this.props.pageType, pageOptions);
    }
  }

  render() {
    let className = "compnentStructureButton btn_style";
    if (this.props.green) className += " green";
    if (this.props.greenBorder) className += " greenBorder";
    if (this.props.white) className += " white";
    if (this.props.rose) className += " rose";
    if (this.props.disabled) className += " disabled";
    if (this.props.className) className += ` ${this.props.className}`;

    const extraProps = this.props.extra ? this.props.extra : {};

    if (!this.props.children)
      extraProps.dangerouslySetInnerHTML = { __html: this.props.text };

    const href = this.getHref();

    let link = null;
    if (href) {
      link = (
        <a {...extraProps} onClick={this.handleOnClick.bind(this)} href={href}>
          {this.props.children}
        </a>
      );
    } else {
      link = (
        <span {...extraProps} onClick={this.handleOnClick.bind(this)}>
          {this.props.children}
        </span>
      );
    }

    return (
      <div className={className}>
        {this.props.isLoading ? <LoadingIndicator /> : link}
      </div>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func,
  green: PropTypes.bool,
  white: PropTypes.bool,
  rose: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
