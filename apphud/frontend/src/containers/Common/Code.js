import React, { Component } from "react"
import { connect } from "react-redux"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { NotificationManager } from "../../libs/Notifications"
import {track} from "../../libs/helpers";

const DEFAULT_LABEL = "No label"
const DEFAULT_COPY_CONTENT = "No content"

class Code extends Component {
  onCopyCommand = () => {
    NotificationManager.success("Copied", "OK", 5000)
  };

  render() {
    const { label, copyContent, className } = this.props

    return (
      <div className={"newapp-code " + className}>
        {label || DEFAULT_LABEL}
        <CopyToClipboard
          className="cp newapp-copy__field"
          text={copyContent || DEFAULT_COPY_CONTENT}
          onCopy={(...e) => {
            this.onCopyCommand(...e);
            this.props.onCodeCopied();
          }}
        >
          <div>
            <svg
              className="va-middle"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.5 1.5C3.11929 1.5 2 2.61929 2 4V12H3V4C3 3.17157 3.67157 2.5 4.5 2.5H11.5V1.5H4.5ZM6 3.5C4.89543 3.5 4 4.39543 4 5.5V13.5C4 14.6046 4.89543 15.5 6 15.5H12C13.1046 15.5 14 14.6046 14 13.5V5.5C14 4.39543 13.1046 3.5 12 3.5H6Z"
                fill="#97ADC6"
              />
            </svg>
            <span className="newapp-code__copy-text">Copy</span>
          </div>
        </CopyToClipboard>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Code)
