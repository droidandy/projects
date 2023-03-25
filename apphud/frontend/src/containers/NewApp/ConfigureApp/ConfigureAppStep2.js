import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import { CopyToClipboard } from "react-copy-to-clipboard"
import history from "../../../history"
import Aux from "../../../hoc/Aux"
import { NotificationManager } from "../../../libs/Notifications"
import image from "../../../assets/images/image-subscription_status_url.png"
import Code from "../../Common/Code"
import { fetchApplicationRequest } from "../../../actions/application"
import {track} from "../../../libs/helpers";

class ConfigureAppStep2 extends Component {
  state = {
    copied: false
  };

  onCopy = () => {
    this.setState({ copied: true })
    setTimeout(() => {
      this.setState({ copied: false })
    }, 1000)
  };

  next = (e) => {
    history.push({
      pathname: `/configureapp/${this.props.match.params.appId}/3`,
      search: this.props.history.location.search
    })
    track("onboarding_server_notifications_continue_button_clicked")
  };

  componentWillMount() {
    this.props.fetchApplicationRequest(this.props.match.params.appId)
  }

  componentDidMount() {
    document.title = "Apphud | Configure app"
    window.scrollTo(0, 0)
  }

  onCopyCommand = () => {
    NotificationManager.success("Copied", "OK", 5000)
  };

  render() {
    const { newapp } = this.props

    return (
      <div>
        <div className="dashboard-checklist dashboard-checklist_fs15">
          <div className="dashboard-checklist__title">Important</div>
          <div className="dashboard-checklist__content">
            URL for App Store server notification is required for correct work. If you already have your own URL inserted, you can still use Apphud URL and proxy Apple notifications from Apphud to own server. {" "}
            <a
              href="https://docs.apphud.com/getting-started/creating-app#subscription-status-url-proxy"
              className="link link_normal"
              target="_blank"
              onClick={() => track("onboarding_server_notifications_learn_more_link_clicked")}
            >
              Learn more
            </a>

          </div>
        </div>
        <div className="newapp-content__text mb15">Copy this URL:</div>
        <Code
          className="mb15"
          label={`https://api.apphud.com/appstore/${newapp.api_key}`}
          copyContent={`https://api.apphud.com/appstore/${newapp.api_key}`}
          onCodeCopied={() => track("onboarding_server_notifications_url_copied")}
        />
        <div className="newapp-content__title">
          Open{" "}
          <a
            href="https://appstoreconnect.apple.com/"
            target="_blank"
            className="link link_normal"
            onClick={() => track("onboarding_server_notifications_aps_connect_link_clicked")}
          >
            App Store Connect
          </a>
          , go to “My Apps” and choose your app. Under "General Information"
          find "URL for App Store Server Notifications", paste this URL and save
          changes.
        </div>
        <div className="newapp-content__steps">
          <div className="ta-center" style={{ height: 430 }}>
            <img src={image} alt="Screenshot" width="540px" />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    newapp: state.application
  }
}

const mapDispatchToProps = {
  fetchApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureAppStep2)
