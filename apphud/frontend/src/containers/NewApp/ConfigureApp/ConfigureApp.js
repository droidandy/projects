import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Route } from "react-router-dom"
import TopPanel from "../../Container/TopPanel/TopPanel"

import ConfigureAppStep1 from "./ConfigureAppStep1"
import ConfigureAppStep2 from "./ConfigureAppStep2"
import ConfigureAppStep3 from "./ConfigureAppStep3"
import ConfigureAppStep4 from "./ConfigureAppStep4"
import classNames from "classnames"
import history from "../../../history"
import {track} from "../../../libs/helpers";

class ConfigureApp extends Component {
  itemClass = (stepItem) => {
    const { step } = this.props.match.params
    return classNames("newapp-header__steps-item", {
      "newapp-header__steps-item_active": parseInt(step, 10) === stepItem,
      "newapp-header__steps-item_completed": parseInt(step, 10) > stepItem
    })
  };

  next = (e) => {
    const { step } = this.props.match.params
    const newStep = !this.props.newapp.bundle_id && parseInt(step) === 1 ? parseInt(step) + 2 : parseInt(step) + 1;
    history.push({
      pathname: `/configureapp/${this.props.newapp.id}/${newStep}`,
      search: this.props.history.location.search,
    })


    switch (Number(step)) {
      case 3:
        track("onboarding_products_continue_button_clicked");
        break;
      case 2:
        track("onboarding_server_notifications_continue_button_clicked");
        break;
      case 1:
        track("onboarding_sdk_continue_button_clicked");
        break;
      default:
        track("onboarding_sdk_continue_button_clicked");
        break;
    }
  }

  finish = () => {
    history.push({
      pathname: `/apps/${this.props.newapp.id}/dashboard`,
      search: this.props.history.location.search,
    });
    track("user_signed_up");
    const platform = this.props.newapp.bundle_id ? 'ios' : 'android';
    track(`${platform}_app_created`, this.props.newapp);
  }

  componentDidMount() {
    document.title = "Apphud | Configure app"
  }

  getTitle = () => {
    const { step } = this.props.match.params
    switch(parseInt(step)) {
      case 1: return 'Integrate SDK';
      case 2: return 'Server notifications URL';
      case 3: return 'Add products';
      case 4: return 'Invite team';
    }
  }

  render() {
    const { step } = this.props.match.params

    return (
      <div className="newapp">
        <TopPanel disableMenu={true} />
        <div className="newapp-header">
          <div className="configure-app-container">
            <div className="container-title">
              {this.getTitle()}
            </div>
            <button
              onClick={parseInt(step) === 4 ? this.finish : this.next}
              className="button button_green l-p__button fr mt0"
            >
              <span>{parseInt(step) === 4 ? 'Finish' : 'Continue'}</span>
            </button>
            <div className="newapp-header__steps">
              <div className={this.itemClass(1)}>
                <svg
                  className="newapp-header__steps-item__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15 5H1V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V5ZM12 11H9V12H12V11ZM7.62132 9.5L6.91421 10.2071L5.5 11.6213L4.79289 10.9142L6.20711 9.5L4.79289 8.08579L5.5 7.37868L6.91421 8.7929L7.62132 9.5Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 3C1 2.44772 1.44772 2 2 2H14C14.5523 2 15 2.44772 15 3V4H1V3ZM3 3C3 3.27614 2.77614 3.5 2.5 3.5C2.22386 3.5 2 3.27614 2 3C2 2.72386 2.22386 2.5 2.5 2.5C2.77614 2.5 3 2.72386 3 3ZM4 3.5C4.27614 3.5 4.5 3.27614 4.5 3C4.5 2.72386 4.27614 2.5 4 2.5C3.72386 2.5 3.5 2.72386 3.5 3C3.5 3.27614 3.72386 3.5 4 3.5Z"
                    fill="white"
                  />
                </svg>
                <span>Integrate SDK</span>
                <svg
                  className="newapp-header__steps-item__triangle"
                  width="23"
                  height="40"
                  viewBox="0 0 23 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0.5H4.06079C6.54454 0.5 8.88741 1.65364 10.4018 3.62232L21.124 17.5612C22.23 18.999 22.23 21.001 21.124 22.4388L10.4018 36.3777C8.88741 38.3464 6.54454 39.5 4.06079 39.5H0"
                    stroke="#0085FF"
                  />
                </svg>
              </div>
              {this.props.newapp.bundle_id && <div className={this.itemClass(2)}>
                <svg
                  className="newapp-header__steps-item__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.91933 10.854L3.33333 9.43933L3.098 9.20467C3.01267 9.11933 3 9.02 3 8.968C3 8.91667 3.01267 8.81733 3.098 8.73267L8.75533 3.07533C8.84 2.99067 8.93933 2.978 8.99067 2.978C9.04267 2.978 9.142 2.99067 9.22667 3.076L9.462 3.31133L10.8767 1.89667L10.64 1.66133C9.75867 0.779333 8.22133 0.78 7.34 1.66067L1.68333 7.318C1.24267 7.758 1 8.34467 1 8.968C1 9.59133 1.24267 10.1773 1.68333 10.6187L1.91933 10.854Z"
                    fill="white"
                  />
                  <path
                    d="M14.1753 5.19667L12.7613 6.61067L12.9973 6.84667C13.1266 6.976 13.1266 7.18734 12.9973 7.31734L7.34063 12.974C7.25596 13.0593 7.15663 13.072 7.10463 13.072C7.05263 13.072 6.95396 13.0593 6.86863 12.9747L6.63263 12.7387L5.21863 14.1533L5.45463 14.3887C5.8953 14.8293 6.48129 15.072 7.10463 15.072C7.72796 15.072 8.31396 14.8293 8.75463 14.3887L14.412 8.732C15.3213 7.82134 15.3213 6.342 14.412 5.43267L14.1753 5.19667Z"
                    fill="white"
                  />
                  <path
                    d="M14.4116 3.07553L12.9976 1.66113L8.28242 6.37494L9.69642 7.78934L14.4116 3.07553Z"
                    fill="white"
                  />
                  <path
                    d="M7.81178 9.67464L6.39758 8.26044L1.68358 12.9744L3.09778 14.3886L7.81178 9.67464Z"
                    fill="white"
                  />
                </svg>
                <span>Server notifications</span>
                <svg
                  className="newapp-header__steps-item__triangle"
                  width="23"
                  height="40"
                  viewBox="0 0 23 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0.5H4.06079C6.54454 0.5 8.88741 1.65364 10.4018 3.62232L21.124 17.5612C22.23 18.999 22.23 21.001 21.124 22.4388L10.4018 36.3777C8.88741 38.3464 6.54454 39.5 4.06079 39.5H0"
                    stroke="#0085FF"
                  />
                </svg>
              </div> }
              <div className={this.itemClass(3)}>
                <svg
                  className="newapp-header__steps-item__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="4" cy="13.5" r="1.5" fill="white" />
                  <circle cx="9.5" cy="13.5" r="1.5" fill="white" />
                  <path
                    d="M11 4H2.23699C1.60034 4 1.12579 4.58702 1.25918 5.20953L2.33061 10.2095C2.42941 10.6706 2.83688 11 3.30842 11H9.73991C10.1891 11 10.5832 10.7005 10.7034 10.2676L13 2H15V1H12.7208C12.2903 1 11.9082 1.27543 11.7721 1.68377L11 4Z"
                    fill="white"
                  />
                </svg>
                <span>Add products</span>
                <svg
                  className="newapp-header__steps-item__triangle"
                  width="23"
                  height="40"
                  viewBox="0 0 23 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0.5H4.06079C6.54454 0.5 8.88741 1.65364 10.4018 3.62232L21.124 17.5612C22.23 18.999 22.23 21.001 21.124 22.4388L10.4018 36.3777C8.88741 38.3464 6.54454 39.5 4.06079 39.5H0"
                    stroke="#0085FF"
                  />
                </svg>
              </div>
              <div className={this.itemClass(4)}>
                <svg
                  className="newapp-header__steps-item__icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="6" cy="5.5" r="3" fill="#97ADC6" />
                  <path
                    d="M11 14C11 12.6739 10.4732 11.4021 9.53553 10.4645C8.59785 9.52678 7.32608 9 6 9C4.67392 9 3.40215 9.52678 2.46447 10.4645C1.52678 11.4021 1 12.6739 1 14L6 14H11Z"
                    fill="#97ADC6"
                  />
                  <circle cx="11.5" cy="6" r="1.5" fill="#97ADC6" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.0793 11C11.8316 10.4326 11.4784 9.9107 11.0322 9.46447C10.6586 9.09087 10.232 8.7825 9.77002 8.54669C10.2721 8.19332 10.8744 8 11.4967 8C12.2923 8 13.0554 8.31607 13.618 8.87868C14.1806 9.44129 14.4967 10.2044 14.4967 11H12.0793Z"
                    fill="#97ADC6"
                  />
                </svg>
                <span>Invite team</span>
                <svg
                  className="newapp-header__steps-item__triangle"
                  width="23"
                  height="40"
                  viewBox="0 0 23 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0.5H4.06079C6.54454 0.5 8.88741 1.65364 10.4018 3.62232L21.124 17.5612C22.23 18.999 22.23 21.001 21.124 22.4388L10.4018 36.3777C8.88741 38.3464 6.54454 39.5 4.06079 39.5H0"
                    stroke="#0085FF"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="newapp-content_configure">
          <div className="configure-app-container">
            <Route
              component={ConfigureAppStep1}
              path="/configureapp/:appId/1"
            />
            <Route
              component={ConfigureAppStep2}
              path="/configureapp/:appId/2"
            />
            <Route
              component={ConfigureAppStep3}
              path="/configureapp/:appId/3"
            />
            <Route
              component={ConfigureAppStep4}
              path="/configureapp/:appId/4"
            />
            <Route
              component={ConfigureAppStep4}
              path="/configureapp/:appId/5"
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    newapp: state.application,
    user: state.sessions
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureApp)
