import React, { Component } from "react"
import { connect } from "react-redux"
import axios from "axios"
import ResultModal from "./ResultModal"
import {track} from "../../libs/helpers";

class ConfirmEmailPanel extends Component {
  state = {
    loading: false,
    resultModal: {
      title: "",
      description: "",
      show: false
    }
  };

  componentDidMount() {
    track("email_confirmation_bar_shown");
  }

  handleResendEmail = () => {
    this.setState({ loading: true })

    axios
      .post("/user/send_confirmation")
      .then((result) => {
        this.setState({ loading: false })
        this.showResultModal({
          title: "Information",
          description: result.data.data.results.message
        })
        track("email_confirmation_bar_resend_button_clicked");
      })
      .catch(() => {
        this.setState({ loading: false })
      })
  };

  showResultModal = ({ title, description }) => {
    this.setState({ resultModal: { title, description, show: true } })
  };

  closeResultModal = () => {
    this.setState({ resultModal: { title: "", description: "", show: false } })
  };

  render() {
    const { loading, resultModal } = this.state

    return (
      <div className="billing-panel__wrapper">
        {resultModal.show && (
          <ResultModal
            title={resultModal.title}
            description={resultModal.description}
            close={this.closeResultModal}
            onConfirm={this.closeResultModal}
          />
        )}
        <div className="billing-panel">
          <span>Please, confirm your email</span>
          <button
            disabled={loading}
            className="button button_160 billing-panel__button button_white text-red va-middle button_inline-block"
            onClick={this.handleResendEmail}
          >
            Resend confirmation
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmEmailPanel)
