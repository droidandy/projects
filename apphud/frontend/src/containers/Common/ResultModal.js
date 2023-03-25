import React, { Component } from "react"
import { connect } from "react-redux"
import NumberFormat from "react-number-format"
import Modal from "react-modal"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 8,
    width: 410
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

const DEFAULT_BUTTON_COLOR = "blue"

class ResultModal extends Component {
  render() {
    const { title, description, close, onConfirm } = this.props

    return (
      <Modal
        isOpen={true}
        onRequestClose={close}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Result modal"
      >
        <div tabIndex={1} style={{ padding: "20px 30px" }}>
          <div className="newapp-header__title">{title}</div>
          <div className="input-wrapper">{description}</div>
          <div className="input-wrapper ta-center">
            <button
              className={`button button_${
                this.props.buttonColor || DEFAULT_BUTTON_COLOR
              } button_160`}
              onClick={onConfirm}
            >
              <span>OK</span>
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ResultModal)
