import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Route } from "react-router-dom"
import history from "../../../../history"
import classNames from "classnames"
import axios from "axios"

import DashboardItem from "../../../../components/DashboardItem"
import ScreensConfiguredItem from "../../Screens/ScreensConfiguredItem"
import PresentScreen from "./PresentScreen"
import Survey from "./Survey"
import Feedback from "./Feedback"
import BillingIssue from "./BillingIssue"

class RulesAnalyzeScreen extends Component {
  state = {
    screens: [],
    screenHtml: "",
    screenLoading: true
  };

  getScreenHTML = ({ preview_url }) => {
    axios.get(`${preview_url}`).then(({ data }) => {
      this.setState({ screenHtml: data })
      setTimeout(() => {
        this.setState({ screenLoading: false })
      }, 1000)
    })
  };

  getScreen = () => {
    const { screenHtml } = this.state
    const { screens, match } = this.props
    const { screenId } = match.params
    const screen = screens.find((screen) => screen.screen.id === screenId)

    if (screen) {
      if (!screenHtml) this.getScreenHTML(screen.screen)

      return screen
    } else return {}
  };

  componentWillReceiveProps(nextProps) {
    const { screenId } = this.props.match.params

    if (screenId !== nextProps.match.params.screenId) {
      const { screens } = this.props
      const screen = screens.find(
        (screen) => screen.screen.id === nextProps.match.params.screenId
      )
      this.setState({ screenLoading: true })
      this.getScreenHTML(screen.screen)
    }
  }

  render() {
    const { application, match } = this.props
    const { screens, screenHtml, screenLoading } = this.state
    const { appId, screenId } = match.params

    const screen = this.getScreen()

    return (
      <div>
        <div className="rules-analytics__actions-left">
          <div className="purchase-screens__configured">
            {screenLoading && (
              <div
                className="animated-background timeline-item"
                style={{ width: 320, height: 570, marginBottom: 30 }}
              />
            )}
            {!screenLoading && (
              <ScreensConfiguredItem
                options={false}
                hideHeader={true}
                screen={{ html: screenHtml }}
                remove={() => {}}
                appId={appId}
                viewOnly={true}
              />
            )}
          </div>
        </div>
        {screen.screen && (
          <div className="rules-analytics__actions-right">
            {["promo", "purchase"].indexOf(screen.screen.kind) > -1 && (
              <PresentScreen screen={screen} />
            )}
            {screen.screen.kind === "survey" && <Survey screen={screen} />}
            {screen.screen.kind === "feedback" && (
              <Feedback appId={appId} screen={screen} />
            )}
            {screen.screen.kind === "billing_issue" && (
              <BillingIssue screen={screen} />
            )}
          </div>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(RulesAnalyzeScreen)
