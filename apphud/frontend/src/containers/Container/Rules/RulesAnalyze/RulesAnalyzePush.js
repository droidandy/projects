import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Route } from "react-router-dom"
import history from "../../../../history"
import classNames from "classnames"
import DashboardItem from "../../../../components/DashboardItem"
import PushPreview from "../../../../containers/Common/PushPreview"

class RulesAnalyzePush extends Component {
  render() {
    const { application, pushStats, pushAction } = this.props
    return (
      <div>
        <div className="rules-analytics__actions-left">
          <PushPreview
            title={pushAction.heading[application.default_locale]}
            text={pushAction.text[application.default_locale]}
            appIconUrl={application.icon_url}
            appTitle={application.name}
          />
        </div>
        <div className="rules-analytics__actions-right">
          <div className="dashboard-group__content">
            <div className="dashboard-row">
              <div className="rules-analyze__box">
                <DashboardItem
                  title="Push sent"
                  value={pushStats.sent}
                  prefix=""
                  autorenews={false}
                  tipTitle="Push sent"
                  tipDescription="Number of sent Push notifications."
                  tipButtonUrl=""
                  loading={false}
                />
              </div>
              <div className="rules-analyze__box">
                <DashboardItem
                  title="Push opened"
                  value={pushStats.opened}
                  prefix=""
                  autorenews={false}
                  tipTitle="Push opened"
                  tipDescription="Number of opened Push notifications."
                  tipButtonUrl=""
                  loading={false}
                />
              </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RulesAnalyzePush)
