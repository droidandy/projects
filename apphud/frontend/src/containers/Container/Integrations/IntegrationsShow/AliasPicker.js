import React, { Component } from "react"
import { connect } from "react-redux"
import Tip from "../../../Common/Tip"
import Modal from "react-modal"
import classNames from "classnames"

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

class AliasPicker extends Component {
  state = {
    open: false,
    value: ""
  };

  handleChangeValue = (e) => {
    this.setState({ value: e.target.value })
  };

  inputClasses = (field) => {
    const { value } = this.state

    return classNames("input input_stretch input_blue", {
      input_error: this.state.submitted && value && !this.validation(value)
    })
  };

  validation = (value) => {
    return /^[a-z_0-9]+$/.test(value)
  };

  submit = () => {
    this.setState({ submitted: true })
    const { value } = this.state

    if (this.validation(value) && value) {
      this.props.onChange(value)
      this.toggleModal()
    }
  };

  toggleModal = () => {
    this.setState({
      open: !this.state.open,
      value: this.props.value ? this.props.value : ""
    })
  };

  render() {
    const { value } = this.props
    const { open } = this.state

    return (
      <div>
        <div className="input-wrapper__bottom-text input-wrapper__bottom-text_nowrap input-wrapper__bottom-text_integration-alias">
          Alias:&nbsp;
          {value ? (
            <span>
              {value}{" "}
              <span className="cp link link_normal" onClick={this.toggleModal}>
                (Change)
              </span>
              &nbsp;
            </span>
          ) : (
            <span className="cp link link_normal" onClick={this.toggleModal}>
              none&nbsp;
            </span>
          )}
          <Tip
            title="Alias"
            description="Event alias will be sent under “alias” custom key."
          />
        </div>
        <Modal
          isOpen={open}
          onRequestClose={this.toggleModal}
          ariaHideApp={false}
          style={customStyles}
          contentLabel="Add products group"
        >
          <div style={{ padding: "20px 30px" }}>
            <div className="newapp-header__title">Enter event alias</div>
            <div className="input-wrapper">
              <label className={"l-p__label"} htmlFor="alias">
                Event alias
              </label>
              <div className="input-wrapper__required">
                <input
                  id="alias"
                  onChange={this.handleChangeValue}
                  value={this.state.value}
                  autoFocus={true}
                  className={this.inputClasses()}
                  placeholder="Alias"
                />
                <span className="required-label">Required</span>
              </div>
              <div className="input-wrapper__bottom-text">
                It may contain only small letters (a..z), digits (0..9) and
                underscore (_)
              </div>
            </div>
            <div className="input-wrapper">
              <button
                className="button button_blue popup-button fl"
                onClick={this.toggleModal}
              >
                <span>Cancel</span>
              </button>
              <button
                disabled={!this.state.value}
                onClick={this.submit}
                className="button button_green popup-button fr"
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AliasPicker)
