import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Route } from "react-router-dom"
import history from "../../../../history"
import DashboardItem from "../../../../components/DashboardItem"

class PresentScreen extends Component {
  render() {
    const { presentations_count, purchases_count, revenue } = this.props.screen
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
              tipDescription="Number of times this screen was shown to users."
              tipButtonUrl=""
              loading={false}
            />
          </div>
          <div className="rules-analyze__box">
            <DashboardItem
              title="Activations"
              value={purchases_count}
              prefix=""
              autorenews={false}
              tipTitle="Activations"
              tipDescription="Number of subscription activations made on this screen. User may or may not be charged immediately."
              tipButtonUrl="https://blog.apphud.com/subscription-levels/"
              loading={false}
            />
          </div>
        </div>
        <div className="dashboard-row">
          <div className="rules-analyze__box rules-analyze__box mt10">
            <DashboardItem
              title="Gross revenue"
              value={Math.round(revenue)}
              prefix="$"
              autorenews={false}
              tipTitle="Gross revenue"
              tipDescription="Total amount billed to customers for purchasing subscriptions using this screen prior to refunds, taxes and Apple’s commission. Includes subscription renewals until first cancel."
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

export default connect(mapStateToProps, mapDispatchToProps)(PresentScreen)
