import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Route } from "react-router-dom"
import history from "../../../../history"
import DashboardItem from "../../../../components/DashboardItem"

class BillingIssue extends Component {
  render() {
    const { button_tapped_count, presentations_count } = this.props.screen

    return (
      <div className="dashboard-group__content">
        <div className="dashboard-row">
          <div className="rules-analyze__box">
            <DashboardItem
              title="Times presented"
              value={presentations_count}
              prefix=""
              autorenews={false}
              tipTitle="Times presented"
              tipDescription="Number of times billing issue screen was shown to users."
              tipButtonUrl=""
              loading={false}
            />
          </div>
          <div className="rules-analyze__box">
            <DashboardItem
              title="Button tapped"
              value={button_tapped_count}
              prefix=""
              autorenews={false}
              tipTitle="Button tapped"
              tipDescription="Number of times “Update payment info” button was tapped."
              tipButtonUrl=""
              loading={false}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    application: state.application
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(BillingIssue)
