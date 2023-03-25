import React, { Component } from "react";
import Modal from "react-modal";
import Header from "../Header";
import PropTypes from "prop-types";

import "./index.scss";

export default class extends Component {
  render() {
    const customStyles = {
      content: {
        top: "0",
        left: "0",
        right: "auto",
        bottom: "auto",
        marginRight: "0",
      },
    };

    return (
      <Modal
        isOpen={this.props.isOpen}
        onAfterOpen={this.props.afterOpenModal}
        onRequestClose={this.props.handleClose}
        style={customStyles}
        contentLabel={this.props.title || ""}
        className="Modal"
      >
        <div className="header">
          {this.props.title && <Header text={this.props.title} />}
          <div className="close" onClick={this.props.handleClose}>
            <img src={require("./close.svg")} />
          </div>
        </div>
        <div className="content">{this.props.children}</div>
      </Modal>
    );
  }
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  afterOpenModal: PropTypes.bool,
  title: PropTypes.string,
  handleClose: PropTypes.func,
  children: PropTypes.element,
};
