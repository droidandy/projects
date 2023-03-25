import React, { Component } from "react"
import { connect } from "react-redux"
import IOSStatusBar from "../../components/Common/IOSStatusBar"

class PushPreview extends Component {
  onIconError = (e) => {
    e.target.style.display = "none"
  };

  render() {
    const { title, text, appIconUrl, appTitle } = this.props

    return (
      <div className="push-preview">
        <IOSStatusBar color="white" />
        <div className="push-preview__item">
          <div className="push-preview__item__inner">
            <div className="push-preview__item__inner-header">
              <span className="push-preview__item__inner-header__icon-wrapper">
                <img
                  src={appIconUrl}
                  onError={this.onIconError}
                  className="push-preview__item__inner-header__icon"
                  alt="App Icon"
                />
              </span>
              <span className="push-preview__item__inner-header__name va-middle uppercase">
                {appTitle}
              </span>
              <span className="push-preview__item__inner-header__status fr">
                now
              </span>
            </div>
            <div className="push-preview__item__inner-content">
              {title && (
                <div
                  className={
                    "push-preview__item__inner-content__title " +
                    (title &&
                      " push-preview__item__inner-content__title_active")
                  }
                >
                  {title || "My title"}
                </div>
              )}
              <div
                className={
                  "push-preview__item__inner-content__text " +
                  (text && " push-preview__item__inner-content__text_active")
                }
              >
                {text || "My text"}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PushPreview)
