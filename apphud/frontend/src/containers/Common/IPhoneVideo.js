import React, { Component } from "react"
import { connect } from "react-redux"
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
    width: 300,
    overflow: "visible",
    backgroundColor: "transparent",
    border: 0
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.85)"
  }
}

class IPhoneVideo extends Component {
  state = {
    repeatControl: false
  };

  handleVideoEnd = () => {
    this.setState({ repeatControl: true })
  };

  handlePlay = () => {
    this.refs.video.play()
    this.setState({ repeatControl: false })
  };

  render() {
    const { videoUrl, close } = this.props
    const { repeatControl } = this.state

    return (
      <Modal
        isOpen={true}
        onRequestClose={close}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Video tutorial"
      >
        <svg
          onClick={close}
          className="iphone-video__tutorial-close cp"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M38.1421 9.85786C45.9526 17.6683 45.9526 30.3317 38.1421 38.1421C30.3316 45.9526 17.6683 45.9526 9.85786 38.1421C2.04738 30.3316 2.04738 17.6684 9.85786 9.85786C17.6683 2.04738 30.3316 2.04738 38.1421 9.85786ZM26.8284 24L32.4853 29.6568L29.6568 32.4853L24 26.8284L18.3431 32.4853L15.5147 29.6569L21.1716 24L15.5147 18.3431L18.3431 15.5147L24 21.1716L29.6568 15.5147L32.4853 18.3432L26.8284 24Z"
            fill="#EDF3F8"
          />
          <defs>
            <path d="M0 0H48V48H0V0Z" fill="white" />
          </defs>
        </svg>
        <div
          className={
            "iphone-video__tutorial-video " +
            (repeatControl && " iphone-video__tutorial-video__end")
          }
        >
          <video
            ref="video"
            onEnded={this.handleVideoEnd}
            height="581"
            width="268"
            autoPlay
            muted
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
        {repeatControl && (
          <svg
            onClick={this.handlePlay}
            className="cp iphone-video__tutorial-video__repeat-icon"
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="59.9999"
              cy="60"
              r="50"
              transform="rotate(-45 59.9999 60)"
              fill="#0085FF"
            />
            <path
              d="M59.96 78C50 78 41.96 69.96 41.96 60C41.96 50.04 50 42 59.96 42C64.92 42 69.4 44.08 72.64 47.32L63.96 56H83.96V36L76.92 43.04C72.56 38.72 66.6 36 59.96 36C46.72 36 36 46.76 36 60C36 73.24 46.72 84 59.96 84C71.84 84 81.68 75.36 83.56 64H77.48C75.64 72 68.52 78 59.96 78Z"
              fill="white"
            />
            <defs>
              <path d="M0 0H120V120H0V0Z" fill="white" />
            </defs>
          </svg>
        )}
        <svg
          className="iphone-video__tutorial-frame"
          width="300"
          height="610"
          viewBox="0 0 300 610"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M36 0C16.1177 0 0 16.1178 0 36V574C0 593.882 16.1178 610 36 610H264C283.882 610 300 593.882 300 574V36C300 16.1177 283.882 0 264 0H36ZM284 48V562C284 579.673 269.673 594 252 594H48C30.3269 594 16 579.673 16 562V48C16 30.3269 30.3269 16 48 16H72.3333C73.8061 16 75 17.1939 75 18.6667C75 30.4487 84.5513 40 96.3333 40H203.667C215.449 40 225 30.4487 225 18.6667C225 17.1939 226.194 16 227.667 16H252C269.673 16 284 30.3269 284 48Z"
            fill="#EDF3F8"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M182 26C184.209 26 186 24.2091 186 22C186 19.7909 184.209 18 182 18C179.791 18 178 19.7909 178 22C178 24.2091 179.791 26 182 26ZM117 19C115.343 19 114 20.3431 114 22C114 23.6569 115.343 25 117 25H165C166.657 25 168 23.6569 168 22C168 20.3431 166.657 19 165 19H117Z"
            fill="#97ADC6"
          />
        </svg>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(IPhoneVideo)
