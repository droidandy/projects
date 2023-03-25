import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import Aux from "../../../../hoc/Aux"
import { fetchEventsRequest } from "../../../../actions/events"
import Moment from "react-moment"
import titleize from "titleize"
import UserFeedItems from "./UserFeedItems"

class UserFeed extends Component {
  state = {
    loading: true,
    currentSubscription: {}
  };

  componentDidMount() {
    this.getEvents()
  }

  toLowerFirstLetter = (string) => {
    return string.charAt(0).toLowerCase() + string.slice(1)
  };

  getEvents = (props = this.props) => {
    this.setState({ loading: true })
    const { userId, subscriptionId, nonRenewableSubscriptionsIds } = props

    props.fetchEventsRequest(
      {
        userId: userId,
        subscription_ids:
          nonRenewableSubscriptionsIds.indexOf(subscriptionId) > -1
            ? nonRenewableSubscriptionsIds
            : [subscriptionId]
      },
      () => {
        this.setState({ loading: false })
      }
    )
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.subscriptionId !== nextProps.subscriptionId) { this.getEvents(nextProps) }
  }

  currentSubscriptionTagClass = (status) => {
    return classNames("tag va-middle capitalize", {
      tag_red: ["refunded", "expired"].indexOf(status) > -1,
      tag_green: ["active", "intro", "promo", "regular"].indexOf(status) > -1,
      tag_orange: ["trial", "grace"].indexOf(status) > -1,
      tag_silver: status === "none"
    })
  };

  firstItemClasses = () => {
    const { currentSubscription } = this.props
    return classNames(
      "user-feed__item user-feed__item-first user-feed__item_silver-line",
      {
        "user-feed__item_orange-icon":
          ["trial", "grace"].indexOf(currentSubscription.status) > -1,
        "user-feed__item_green-icon":
          ["active", "intro", "promo", "regular"].indexOf(
            currentSubscription.status
          ) > -1,
        "user-feed__item_red-icon":
          ["refunded", "expired"].indexOf(currentSubscription.status) > -1,
        "user-feed__item_silver-icon": currentSubscription.status === "none"
      }
    )
  };

  getDuration = (event) => {
    if (event.properties.trial_duration) { return event.properties.trial_duration.replace(/_/g, " ") } else if (event.properties.intro_duration) { return event.properties.intro_duration.replace(/_/g, " ") } else return ""
  };

  yearIsDifferent = (date) => {
    return new Date(date).getYear() !== new Date().getYear()
  };

  getExpireText = (date) => {
    date = new Date(date).getTime()
    const currentDate = new Date().getTime()
    if (date > currentDate) return "expires at"
    else return "expired at"
  };

  render() {
    const { currentSubscription, appId } = this.props

    return (
      <div className="user-feed">
        {currentSubscription.kind !== "nonrenewable" && (
          <div className={this.firstItemClasses()}>
            <div className="user-feed__item-icon"></div>
            <span className="user-feed__item-title">Now</span>
            <div className="user-feed__item-description">
              <span
                className={this.currentSubscriptionTagClass(
                  currentSubscription.status
                )}
              >
                {currentSubscription.status}
              </span>
              { currentSubscription.local
                && <div className="user-feed__item-autorenewall__status">Local StoreKit</div>
              }
              {currentSubscription.autorenew_enabled ? (
                <div className="user-feed__item-autorenewall__status">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.86563 1.13451C8.50777 0.86441 7.1003 1.00303 5.82122 1.53285C4.54213 2.06266 3.44888 2.95987 2.67971 4.11101C1.91054 5.26215 1.5 6.61553 1.5 8L0.25 8L2.25 10.5L4.25 8L3 8C3 6.9122 3.32257 5.84884 3.92692 4.94437C4.53127 4.0399 5.39025 3.33495 6.39524 2.91867C7.40024 2.50238 8.5061 2.39347 9.573 2.60568C10.6399 2.8179 11.6199 3.34173 12.3891 4.11092C13.1583 4.88011 13.6821 5.86011 13.8943 6.92701C14.1065 7.9939 13.9976 9.09977 13.5813 10.1048C13.1651 11.1098 12.4601 11.9687 11.5556 12.5731C10.6512 13.1774 9.5878 13.5 8.5 13.5V15C9.88447 15 11.2378 14.5895 12.389 13.8203C13.5401 13.0511 14.4373 11.9579 14.9672 10.6788C15.497 9.3997 15.6356 7.99224 15.3655 6.63437C15.0954 5.2765 14.4287 4.02922 13.4497 3.05026C12.4708 2.07129 11.2235 1.4046 9.86563 1.13451Z"
                      fill="#20BF55"
                    />
                    <path
                      d="M6.5 7.90753L8 9.40753L11 6.40753"
                      stroke="#20BF55"
                    />
                  </svg>
                  <span>Autorenewal on</span>
                </div>
              ) : (
                <div className="user-feed__item-autorenewall__status user-feed__item-autorenewall__status_red">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.86563 1.13451C8.50777 0.86441 7.1003 1.00303 5.82122 1.53285C4.54213 2.06266 3.44888 2.95987 2.67971 4.11101C1.91054 5.26215 1.5 6.61553 1.5 8L0.25 8L2.25 10.5L4.25 8L3 8C3 6.9122 3.32257 5.84884 3.92692 4.94437C4.53127 4.0399 5.39025 3.33495 6.39524 2.91867C7.40024 2.50238 8.5061 2.39347 9.573 2.60568C10.6399 2.8179 11.6199 3.34173 12.3891 4.11092C13.1583 4.88011 13.6821 5.86011 13.8943 6.92701C14.1065 7.9939 13.9976 9.09977 13.5813 10.1048C13.1651 11.1098 12.4601 11.9687 11.5556 12.5731C10.6512 13.1774 9.5878 13.5 8.5 13.5V15C9.88447 15 11.2378 14.5895 12.389 13.8203C13.5401 13.0511 14.4373 11.9579 14.9672 10.6788C15.497 9.3997 15.6356 7.99224 15.3655 6.63437C15.0954 5.2765 14.4287 4.02922 13.4497 3.05026C12.4708 2.07129 11.2235 1.4046 9.86563 1.13451Z"
                      fill="#FF0C46"
                    />
                    <rect
                      x="6.37866"
                      y="6.99332"
                      width="1"
                      height="5"
                      transform="rotate(-45 6.37866 6.99332)"
                      fill="#FF0C46"
                    />
                    <rect
                      x="6.37866"
                      y="9.82175"
                      width="5"
                      height="1"
                      transform="rotate(-45 6.37866 9.82175)"
                      fill="#FF0C46"
                    />
                  </svg>
                  <span>Autorenewal off</span>
                </div>
              )}
              {currentSubscription.status !== "grace" &&
                !currentSubscription.autorenew_enabled && (
                <div className="user-feed__item-bottom__info-item user-feed__item-bottom__info-item_2">
                  <svg
                    className="va-middle"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="2" y="1" width="1" height="14" fill="#97ADC6" />
                    <path
                      d="M9 1H5C4.44772 1 4 1.44772 4 2V8C4 8.55228 4.44772 9 5 9H8L7.03647 10.4453C6.59343 11.1099 7.06982 12 7.86852 12H13C13.5523 12 14 11.5523 14 11V5C14 4.44772 13.5523 4 13 4H10V2C10 1.44772 9.55228 1 9 1Z"
                      fill="#97ADC6"
                    />
                  </svg>
                  <span>
                    {this.getExpireText(currentSubscription.expires_at)}
                    <span className="uppercase">
                      <Moment
                        format="MMM DD, Y, HH:mm"
                        date={currentSubscription.expires_at}
                      />
                    </span>
                  </span>
                </div>
              )}
              {currentSubscription.status !== "grace" &&
                currentSubscription.autorenew_enabled && (
                <div className="user-feed__item-bottom__info-item user-feed__item-bottom__info-item_2">
                  <svg
                    className="va-middle"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="2" y="1" width="1" height="14" fill="#97ADC6" />
                    <path
                      d="M9 1H5C4.44772 1 4 1.44772 4 2V8C4 8.55228 4.44772 9 5 9H8L7.03647 10.4453C6.59343 11.1099 7.06982 12 7.86852 12H13C13.5523 12 14 11.5523 14 11V5C14 4.44772 13.5523 4 13 4H10V2C10 1.44772 9.55228 1 9 1Z"
                      fill="#97ADC6"
                    />
                  </svg>
                  <span>
                      renews at
                    <span className="uppercase">
                      <Moment
                        format="MMM DD, Y, HH:mm"
                        date={currentSubscription.expires_at}
                      />
                    </span>
                  </span>
                </div>
              )}
              {["grace"].indexOf(currentSubscription.status) > -1 && (
                <div className="user-feed__item-bottom__info-item user-feed__item-bottom__info-item_2">
                  <svg
                    className="va-middle"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="2" y="1" width="1" height="14" fill="#97ADC6" />
                    <path
                      d="M9 1H5C4.44772 1 4 1.44772 4 2V8C4 8.55228 4.44772 9 5 9H8L7.03647 10.4453C6.59343 11.1099 7.06982 12 7.86852 12H13C13.5523 12 14 11.5523 14 11V5C14 4.44772 13.5523 4 13 4H10V2C10 1.44772 9.55228 1 9 1Z"
                      fill="#97ADC6"
                    />
                  </svg>
                  <span>
                    active till
                    <span className="uppercase">
                      <Moment
                        format="MMM DD, Y, HH:mm"
                        date={currentSubscription.expires_at}
                      />
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {this.state.loading && (
          <div>
            <div className="animated-background timeline-item" />
            <div className="animated-background timeline-item timeline-item__row" />
            <div className="animated-background timeline-item timeline-item__row" />
            <div className="animated-background timeline-item timeline-item__row" />
          </div>
        )}
        {!this.state.loading && (
          <UserFeedItems
            appId={appId}
            customer={this.props.customer}
            currentSubscription={currentSubscription}
            events={this.props.events}
          />
        )}
        <div className="user-feed__item user-feed__item_blue-icon">
          <div className="user-feed__item-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 13 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginTop: -2 }}
            >
              <circle cx="5" cy="6.5" r="3" fill="white" />
              <path
                d="M10 15C10 13.6739 9.47322 12.4021 8.53553 11.4645C7.59785 10.5268 6.32608 10 5 10C3.67392 10 2.40215 10.5268 1.46447 11.4645C0.526784 12.4021 2.00233e-07 13.6739 0 15L5 15H10Z"
                fill="white"
              />
              <rect x="11" y="2" width="1" height="5" fill="white" />
              <rect x="9" y="4" width="5" height="1" fill="white" />
            </svg>
          </div>
          <div className="user-feed__item-date uppercase">
            <Moment
              format="MMM DD, Y, HH:mm"
              date={this.props.customer.created_at}
            />
          </div>
          <span className="user-feed__item-title">User created</span>
        </div>
        {!this.state.loading && (
          <UserFeedItems
            old={true}
            appId={appId}
            customer={this.props.customer}
            currentSubscription={currentSubscription}
            events={this.props.events}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events
  }
}

const mapDispatchToProps = {
  fetchEventsRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(UserFeed)
