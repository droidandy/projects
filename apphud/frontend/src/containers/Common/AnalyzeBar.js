import React, { Component } from "react"
import { connect } from "react-redux"
import NumberFormat from "react-number-format"

class AnalyzeBar extends Component {
  render() {
    const { percent, count, title, trackColor, backgroundColor } = this.props

    return (
      <div className="analyze-bar">
        <div className="analyze-bar__percent">
          {parseFloat(percent).toFixed(1)}%
        </div>
        <div className="analyze-bar__line" style={{ backgroundColor }}>
          <div
            className="analyze-bar__line-track"
            style={{ width: `${percent}%`, background: trackColor }}
          />
          <div className="analyze-bar__line-title fl">{title} –&nbsp;</div>
          <div className="analyze-bar__line-count">
            <NumberFormat
              value={count}
              displayType={"text"}
              thousandSeparator={true}
            />
            &nbsp;users
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

export default connect(mapStateToProps, mapDispatchToProps)(AnalyzeBar)
