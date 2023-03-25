import React from "react";
import "./index.scss";
import Header from "../Header";
import PropTypes from "prop-types";

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    //  if (!this.props.header) throw Error("prop.header is required");
  }

  render() {
    return (
      <div className="componentPage">
        <Header text={this.props.header} />
        {this.props.children}
      </div>
    );
  }
}

Page.propTypes = {
  header: PropTypes.string,
  children: PropTypes.element,
};
