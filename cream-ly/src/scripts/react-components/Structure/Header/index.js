import React from "react";
import "./index.scss";
import PropTypes, { bool } from "prop-types";

export default class Header extends React.Component {
  render() {
    let className = "section-header ";
    className += this.props.sub ? " sub" : "";
    const HeaderTag = `h${this.props.isPageHeader ? 1 : 2}`;

    const children = this.props.children ? (
      <HeaderTag>{this.props.children}</HeaderTag>
    ) : (
      <HeaderTag dangerouslySetInnerHTML={{ __html: this.props.text }}></HeaderTag>
    );

    return (
      <header key="header" className={className}>
        {children}
      </header>
    );
  }
}

Header.defaultProps = {
  isPageHeader: false
};

Header.propTypes = {
  text: PropTypes.string,
  sub: PropTypes.bool,
  isPageHeader: bool
};
