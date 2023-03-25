import React from "react"
import PropTypes from "prop-types"
import classnames from "classnames"
import { connect } from "react-redux"
import axios from "axios"

class Notification extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(["info", "success", "warning", "error"]),
    title: PropTypes.node,
    message: PropTypes.node.isRequired,
    timeOut: PropTypes.number,
    onClick: PropTypes.func,
    onRequestHide: PropTypes.func
  };

  static defaultProps = {
    type: "info",
    title: null,
    message: null,
    timeOut: 5000,
    onClick: () => {},
    onRequestHide: () => {}
  };

  componentDidMount = () => {
    const { timeOut } = this.props
    if (timeOut !== 0) {
      this.timer = setTimeout(this.requestHide, timeOut)
    }
  };

  componentWillUnmount = () => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  };

  close = () => {
    const { onClick } = this.props
    if (onClick) {
      onClick()
    }
    this.requestHide()
  };

  handleClick = () => {
    const { onClick } = this.props
    if (onClick) {
      onClick()
    }
    this.requestHide()
  };

  requestHide = () => {
    const { onRequestHide } = this.props
    if (onRequestHide) {
      onRequestHide()
    }
  };

  resendEmailConfirmation = () => {
    axios.post("/users/resend_confirmation")
  };

  goTo = (e, url, worker) => {
    e.preventDefault()

    if (worker) {
      worker.postMessage({ action: "skipWaiting" })
      return
    }
    if (url === "resendEmailConfirmation") {
      this.resendEmailConfirmation()
      this.close()
    } else {
      if (window.ENV === "development") { url = url.replace("lvh.me", "lvh.me:3000") }
      window.open(url, "", "_blank")
    }
  };

  render() {
    const {
      type,
      message,
      buttons,
      buttonCloseText,
      buttonLinkText,
      buttonLinkUrl,
      buttonLinkTarget,
      worker
    } = this.props
    let { title } = this.props
    const className = classnames(["notification", `notification-${type}`])
    title = title ? <h4 className="title">{title}</h4> : null
    return (
      <div className={className} onClick={this.handleClick}>
        {type === "success" && (
          <svg
            style={{ verticalAlign: "middle", marginRight: 10 }}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 0.999996C4.1339 0.999996 1 4.1339 1 8C1 11.8661 4.1339 15 8 15C11.8661 15 15 11.8661 15 8C15 4.1339 11.8654 0.999996 8 0.999996ZM7.475 12.025L3.975 9.4L5.025 8L7.125 9.575L10.8 4.675L12.2 5.725L7.475 12.025Z"
              fill="#20BF55"
            />
          </svg>
        )}
        <div
          className="notification-message"
          role="alert"
          style={{ display: "inline-block" }}
        >
          {title}
          <div className="message">{message}</div>
          {buttons && (
            <div className="notification-message__buttons">
              <button
                onClick={this.close}
                className="notification-message__button-close"
              >
                {buttonCloseText}
              </button>
              <a
                href={buttonLinkUrl}
                target={buttonLinkTarget}
                onClick={(e) => {
                  this.goTo(e, buttonLinkUrl, worker)
                }}
                className="notification-message__button-link"
              >
                {buttonLinkText}
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
