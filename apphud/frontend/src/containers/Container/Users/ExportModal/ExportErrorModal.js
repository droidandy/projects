import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import { NavLink } from "react-router-dom"

const customStylesPopUp = {
  content: {
    position: "relative",
    margin: "auto",
    padding: 0,
    borderRadius: 8,
    width: 410,
    overlfow: "visible"
  },
  overlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

class ExportErrorModal extends Component {
  render() {
    const { handleToggleExportUsers } = this.props

    return (
      <Modal
        isOpen={true}
        className="ReactModal__Content ReactModal__Content-visible"
        onRequestClose={handleToggleExportUsers}
        ariaHideApp={false}
        style={customStylesPopUp}
        shouldFocusAfterRender={false}
        contentLabel="Add filter"
      >
        <div
          style={{ padding: "20px 30px" }}
          className="purchase-screen__edit-insert__macros-modal"
        >
          <div className="newapp-header__title">Export error</div>
          <div className="mt15">You don’t have permission to export users.</div>
          <div className="ta-center mt20">
            <button
              onClick={handleToggleExportUsers}
              className="button button_green button_160"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ExportErrorModal)
