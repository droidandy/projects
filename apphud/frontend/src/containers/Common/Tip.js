import React, { Component } from "react"
import { connect } from "react-redux"
import Tooltip from "rc-tooltip"
import {track} from "../../libs/helpers";

class Tip extends Component {
  overlay = () => {
    const { title, description, buttonUrl, width = 300, trackId =  "charts_learn_more_clicked"} = this.props
    return (
      <div>
        <div className={`tip-content tip-content_center tip_${width}`} style={{width: `${width}px`}} ref="content">
          {title && (
            <div
              className="tip-content__title"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {typeof description === "string"
            ? <div
              className="tip-content__description"
              dangerouslySetInnerHTML={{ __html: description }}
              style={!title ? { marginTop: 0 } : {}}
            />
            : <div className="tip-content__description" style={!title ? { marginTop: 0 } : {}}>
                {description}
            </div>
          }

          {buttonUrl && (
            <div className="tip-content__button">
              <a
                className="button button_blue button_inline button_160"
                href={buttonUrl}
                target="_blank"
                onClick={() => track(trackId, {link_url: buttonUrl})}
              >
                Learn more
              </a>
            </div>
          )}
        </div>
      </div>
    )
  };

  render() {
    const { trigger, children } = this.props

    return (
      <div className="tip">
        <Tooltip
          mouseEnterDelay={0.2}
          placement="bottom"
          trigger={[trigger || "hover"]}
          overlay={this.overlay()}
        >
          <div className="tip-icon" ref="icon">
              {children || (
                  <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                      <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM6.55557 5.83147C6.39112 5.94135 6.19778 6 6 6H5.5V7.5H6.5V6.93649C6.6746 6.89141 6.84286 6.82278 7 6.73205C7.03771 6.71028 7.07478 6.68724 7.11114 6.66294C7.44004 6.44318 7.69638 6.13082 7.84776 5.76537C7.99913 5.39992 8.03874 4.99778 7.96157 4.60982C7.8844 4.22186 7.69392 3.86549 7.41421 3.58579C7.13451 3.30608 6.77814 3.1156 6.39018 3.03843C6.00222 2.96126 5.60009 3.00087 5.23463 3.15224C4.86918 3.30362 4.55682 3.55996 4.33706 3.88886C4.31276 3.92522 4.28972 3.96229 4.26795 4C4.0928 4.30337 4 4.64817 4 5H5C5 4.80222 5.05865 4.60888 5.16853 4.44443C5.27841 4.27998 5.43459 4.15181 5.61732 4.07612C5.80004 4.00043 6.00111 3.98063 6.19509 4.01922C6.38907 4.0578 6.56725 4.15304 6.70711 4.29289C6.84696 4.43275 6.9422 4.61093 6.98079 4.80491C7.01937 4.99889 6.99957 5.19996 6.92388 5.38268C6.84819 5.56541 6.72002 5.72159 6.55557 5.83147ZM6.64999 8.625C6.64999 8.97018 6.37017 9.25 6.02499 9.25C5.67982 9.25 5.39999 8.97018 5.39999 8.625C5.39999 8.27982 5.67982 8 6.02499 8C6.37017 8 6.64999 8.27982 6.64999 8.625Z"
                          fill="#97ADC6"
                      />
                  </svg>
              )}
          </div>
        </Tooltip>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Tip)
