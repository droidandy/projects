import React from "react";
import "./index.scss";
import PropTypes from "prop-types";

export default class SubHeader extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.text) throw Error("prop.text is required");
  }

  render() {
    let className = "section-sub-header ";
    className += this.props.sub ? " sub" : "";

    return (
      <header key="subheader" className={className}>
        <h2 dangerouslySetInnerHTML={{ __html: this.props.text }}></h2>
      </header>
    );
  }
}

SubHeader.propTypes = {
  text: PropTypes.string,
  sub: PropTypes.bool,
};
