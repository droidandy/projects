import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import ScreensConfiguredItem from "../Container/Screens/ScreensConfiguredItem"
import axios from "axios"
import imageWaiting from "../../assets/images/rules-empty.jpg"

const customStylesPopUp = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 8,
    width: 790,
    height: 700,
    overflow: "hidden"
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100
  }
}

class ScreenPicker extends Component {
  state = {
    open: false,
    appScreensLoading: true,
    screens: []
  };

  handleOpenPopup = () => {
    this.setState({ open: true })
    this.getAppScreens()
  };

  handleClosePopup = () => {
    this.setState({ open: false })
  };

  getAppScreens = () => {
    this.setState({ appScreensLoading: true })
    axios.get(`/apps/${this.props.appId}/screens`).then((response) => {
      const screens = response.data.data.results
        .filter((s) => s.status === "active")
        .filter((s) => s.version === "v2")
      this.setState({ screens, appScreensLoading: false })
    })
  };

  handleSelectScreen = (screen_id) => {
    this.setState({ screen_id })
  };

  save = () => {
    const { screen_id } = this.state
    this.props.onChange(screen_id)
    this.handleClosePopup()
  };

  getScreenName = () => {
    const { screens } = this.props
    const findScreen = screens.find(({ db_id }) => db_id === this.props.value)

    if (findScreen) return findScreen.name
  };

  componentDidMount() {
    const { screens } = this.props

    this.setState({ screen_id: this.props.value })
  }

  render() {
    const { value, appId } = this.props
    const { open, screens, screen_id, appScreensLoading } = this.state

    return (
      <div className="screen-picker">
        <div className="screen-picker__value">{this.getScreenName()}</div>
        <button
          onClick={this.handleOpenPopup}
          className="button button_blue button_160 button_icon"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 1.5C3 0.671573 3.67157 0 4.5 0H11.5C12.3284 0 13 0.671573 13 1.5V14.5C13 15.3284 12.3284 16 11.5 16H4.5C3.67157 16 3 15.3284 3 14.5V1.5ZM4 2C4 1.44772 4.44772 1 5 1H6C6 1.55228 6.44772 2 7 2H9C9.55228 2 10 1.55228 10 1H11C11.5523 1 12 1.44772 12 2V14C12 14.5523 11.5523 15 11 15H5C4.44772 15 4 14.5523 4 14V2Z"
              fill="white"
            />
          </svg>
          <span>Select screen</span>
        </button>
        <Modal
          isOpen={open}
          className="ReactModal__Content ReactModal__Content-visible"
          ariaHideApp={false}
          style={customStylesPopUp}
          onRequestClose={this.handleClosePopup}
          contentLabel="Select screen"
        >
          <div className="screen-picker__modal">
            <div className="screen-picker__modal-container">
              <div className="newapp-header__title">Select screen</div>
              <div className="screen-picker__content">
                {appScreensLoading && (
                  <div
                    className="animated-background timeline-item"
                    style={{ width: 320, height: 570, marginBottom: 30 }}
                  />
                )}
                {!appScreensLoading &&
                  screens.map((screen, index) => (
                    <div
                      className={
                        "rules-actions__item-footer-item " +
                        (screen.db_id === screen_id &&
                          " rules-actions__item-footer-item_active")
                      }
                      key={index}
                    >
                      <ScreensConfiguredItem
                        key={index}
                        options={false}
                        screen={screen}
                        remove={this.removeScreen}
                        appId={appId}
                        viewOnly={true}
                      />
                      <div className="rules-actions__item-footer-item__menu">
                        <div className="rules-actions__item-footer-item__menu-buttons">
                          <div
                            className="rules-actions__item-footer-item__menu-button"
                            onClick={this.handleSelectScreen.bind(
                              null,
                              screen.db_id
                            )}
                          >
                            Select
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {!appScreensLoading && screens.length === 0 && (
                  <div className="ta-center">
                    <img
                      src={imageWaiting}
                      className="empty-label__image"
                      alt="No rules"
                      width="540px"
                      height="350px"
                    />
                    <div className="empty-label__title">No screens created</div>
                  </div>
                )}
              </div>
            </div>
            <div className="screen-picker__footer">
              <button
                className="button button_blue button_160 screen-picker__footer-button"
                onClick={this.handleClosePopup}
              >
                Cancel
              </button>
              <button
                className="button button_green button_160"
                disabled={!screen_id}
                onClick={this.save}
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ScreenPicker)
