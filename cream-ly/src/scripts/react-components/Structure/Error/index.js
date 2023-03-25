import React from "react";
import PropTypes from "prop-types";

export default class Error extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.text) throw Error("prop.text is required");
  }

  render() {
    const children = this.props.children ? (
      this.props.children
    ) : (
      <div dangerouslySetInnerHTML={{ __html: this.props.text }} />
    );

    return (
      <div
        className="error alert alert-danger d-flex align-items-center justify-content-center"
        role="alert"
      >
        <i className="fa fa-exclamation-triangle mx-4" aria-hidden="true"></i>{" "}
        {children}
      </div>
    );
  }
}

Error.propTypes = {
  text: PropTypes.string,
};
