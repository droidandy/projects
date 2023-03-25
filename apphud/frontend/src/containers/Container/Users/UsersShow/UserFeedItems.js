import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import Aux from "../../../../hoc/Aux"
import Moment from "react-moment"
import titleize from "titleize"
import UserFeedItemsIntegrationsStatus from "./UserFeedItemsIntegrationsStatus"

class UserFeedItems extends Component {
  state = {
    currentSubscription: {}
  };

  toLowerFirstLetter = (string) => {
    return string.charAt(0).toLowerCase() + string.slice(1)
  };

  itemClasses = (item) => {
    const isTrial = item.receipt && item.receipt.trial_period
    const greenIconItems = [
      "subscription_started",
      "subscription_renewed",
      "trial_converted",
      "intro_renewed",
      "intro_converted",
      "intro_started",
      "promo_renewed",
      "promo_converted",
      "promo_started",
      "non_renewing_purchase",
      "billing_issue_resolved"
    ]
    const orangeIconItems = ["trial_started"]
    const redIconItems = [
      "subscription_expired",
      "subscription_refunded",
      "intro_refunded",
      "intro_expired",
      "promo_refunded",
      "promo_expired",
      "trial_expired",
      "non_renewing_purchase_refunded",
      "billing_issue"
    ]
    const blueIconItems = [
      "autorenew_enabled",
      "autorenew_disabled",
      "trial_canceled",
      "subscription_canceled"
    ]
    let classes = classNames("user-feed__item user-feed__item_silver-line", {
      "user-feed__item_green-icon": greenIconItems.indexOf(item.kind) > -1,
      "user-feed__item_orange-icon": orangeIconItems.indexOf(item.kind) > -1,
      "user-feed__item_red-icon": redIconItems.indexOf(item.kind) > -1,
      "user-feed__item_blue-icon": blueIconItems.indexOf(item.kind) > -1,
      "user-feed__item_silver-icon": this.props.old
    })

    if (isTrial && item.kind === "promo_started") { classes = classes.replace("green", "orange") }

    return classes
  };

  firstItemClasses = () => {
    const { currentSubscription } = this.props
    return classNames("user-feed__item user-feed__item_silver-line", {
      "user-feed__item_orange-icon":
        ["grace", "trial"].indexOf(currentSubscription.status) > -1,
      "user-feed__item_green-icon":
        ["active", "intro", "promo", "regular"].indexOf(
          currentSubscription.status
        ) > -1,
      "user-feed__item_red-icon":
        ["refunded", "expired"].indexOf(currentSubscription.status) > -1,
      "user-feed__item_silver-icon": currentSubscription.status === "none"
    })
  };

  getDuration = (event) => {
    if (event.properties.intro_offer) { return `${event.properties.intro_offer.units_count} ${event.properties.intro_offer.unit}` } else return null
  };

  yearIsDifferent = (date) => {
    return new Date(date).getYear() !== new Date().getYear()
  };

  filterEvents = (events, old) => {
    const customerCreatedAt = new Date(this.props.customer.created_at).getTime()
    return events.filter(function(event) {
      let eventDate
      eventDate = event.created_at
      eventDate = new Date(eventDate).getTime()

      if (old) return customerCreatedAt > eventDate
      else return customerCreatedAt < eventDate
    })
  };

  getEventsArray = () => {
    let events = this.props.events

    if (this.props.old) {
      events = events.slice(0)
      events = this.filterEvents(events, this.props.old)
    } else {
      events = this.filterEvents(events, this.props.old)
    }

    return events
  };

  showRevenue = (event) => {
    if (this.props.old) return false
    if (
      event.receipt &&
      event.kind !== "trial_started" &&
      event.kind !== "promo_started"
    ) { return true }
    if (
      event.receipt &&
      event.kind === "promo_started" &&
      !event.receipt.trial_period
    ) { return true }

    return false
  };

  render() {
    const { currentSubscription, appId } = this.props
    return this.getEventsArray().map((event, index) => (
      <div className={this.itemClasses(event)} key={event.id}>
        <div
          className={
            "user-feed__item-icon " +
            (this.props.old && "user-feed__item-icon_silver")
          }
        >
          {event.kind.indexOf("promo_") > -1 && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.2071 2.25737L12.4497 2.25737C13.002 2.25737 13.4497 2.70508 13.4497 3.25737L13.4497 7.50001C13.4497 7.76522 13.3444 8.01958 13.1568 8.20711L6.37867 14.9853C5.98815 15.3758 5.35499 15.3758 4.96446 14.9853L0.721821 10.7426C0.331296 10.3521 0.331297 9.71896 0.721821 9.32843L7.5 2.55026C7.68753 2.36272 7.94189 2.25737 8.2071 2.25737ZM9.2071 6.50001C9.79289 7.08579 10.7426 7.08579 11.3284 6.50001C11.9142 5.91422 11.9142 4.96447 11.3284 4.37869C10.7426 3.7929 9.79289 3.7929 9.2071 4.37869C8.62132 4.96447 8.62132 5.91422 9.2071 6.50001Z"
                fill="white"
              />
            </svg>
          )}
          {["subscription_started", "trial_converted", "intro_started"].indexOf(
            event.kind
          ) > -1 && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.86563 1.13451C8.50777 0.86441 7.1003 1.00303 5.82122 1.53285C4.54213 2.06266 3.44888 2.95987 2.67971 4.11101C1.91054 5.26215 1.5 6.61553 1.5 8L0.25 8L2.25 10.5L4.25 8L3 8C3 6.9122 3.32257 5.84884 3.92692 4.94437C4.53127 4.0399 5.39025 3.33495 6.39524 2.91867C7.40024 2.50238 8.5061 2.39347 9.573 2.60568C10.6399 2.8179 11.6199 3.34173 12.3891 4.11092C13.1583 4.88011 13.6821 5.86011 13.8943 6.92701C14.1065 7.9939 13.9976 9.09977 13.5813 10.1048C13.1651 11.1098 12.4601 11.9687 11.5556 12.5731C10.6512 13.1774 9.5878 13.5 8.5 13.5V15C9.88447 15 11.2378 14.5895 12.389 13.8203C13.5401 13.0511 14.4373 11.9579 14.9672 10.6788C15.497 9.3997 15.6356 7.99224 15.3655 6.63437C15.0954 5.2765 14.4287 4.02922 13.4497 3.05026C12.4708 2.07129 11.2235 1.4046 9.86563 1.13451Z"
                fill="white"
              />
              <rect x="5.5" y="5" width="1" height="7" fill="white" />
              <path
                d="M7 5H11C11.5523 5 12 5.44772 12 6V8C12 8.55228 11.5523 9 11 9H7V5Z"
                fill="white"
              />
            </svg>
          )}
          {["non_renewing_purchase"].indexOf(event.kind) > -1 && (
            <svg
              width="24"
              height="26"
              viewBox="0 0 24 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.5433 3.7039C17.8448 4.43185 18 5.21207 18 6H15C15 5.60603 14.9224 5.21593 14.7716 4.85195C14.6209 4.48797 14.3999 4.15726 14.1213 3.87868C13.8427 3.6001 13.512 3.37913 13.1481 3.22836C12.7841 3.0776 12.394 3 12 3C11.606 3 11.2159 3.0776 10.8519 3.22836C10.488 3.37913 10.1573 3.6001 9.87868 3.87868C9.6001 4.15726 9.37913 4.48797 9.22836 4.85195C9.0776 5.21593 9 5.60603 9 6H6C6 5.21207 6.15519 4.43185 6.45672 3.7039C6.75825 2.97595 7.20021 2.31451 7.75736 1.75736C8.31451 1.20021 8.97595 0.758251 9.7039 0.456723C10.4319 0.155195 11.2121 0 12 0C12.7879 0 13.5681 0.155195 14.2961 0.456723C15.0241 0.758251 15.6855 1.20021 16.2426 1.75736C16.7998 2.31451 17.2417 2.97595 17.5433 3.7039ZM24 26L22 8H2L0 26H24Z"
                fill="white"
              />
            </svg>
          )}
          {["subscription_renewed", "intro_renewed", "intro_converted"].indexOf(
            event.kind
          ) > -1 && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="8" y="5.5" width="2" height="1" fill="white" />
              <rect x="8" y="5" width="1" height="1.5" fill="white" />
              <rect x="8" y="9.5" width="1" height="1.5" fill="white" />
              <rect x="7" y="9.5" width="2" height="1" fill="white" />
              <rect x="8" y="7.5" width="1" height="1" fill="white" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.93934 8.06066C7.22064 8.34196 7.60218 8.5 8 8.5L8 7.5C7.72386 7.5 7.5 7.27614 7.5 7C7.5 6.72386 7.72386 6.5 8 6.5V5.5C7.60218 5.5 7.22064 5.65804 6.93934 5.93934C6.65804 6.22064 6.5 6.60218 6.5 7C6.5 7.39782 6.65804 7.77936 6.93934 8.06066Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.0607 7.93934C9.77936 7.65804 9.39782 7.5 9 7.5L9 8.5C9.27614 8.5 9.5 8.72386 9.5 9C9.5 9.27614 9.27614 9.5 9 9.5V10.5C9.39782 10.5 9.77936 10.342 10.0607 10.0607C10.342 9.77936 10.5 9.39782 10.5 9C10.5 8.60218 10.342 8.22064 10.0607 7.93934Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.86563 1.13451C8.50777 0.86441 7.1003 1.00303 5.82122 1.53285C4.54213 2.06266 3.44888 2.95987 2.67971 4.11101C1.91054 5.26215 1.5 6.61553 1.5 8L0.25 8L2.25 10.5L4.25 8L3 8C3 6.9122 3.32257 5.84884 3.92692 4.94437C4.53127 4.0399 5.39025 3.33495 6.39524 2.91867C7.40024 2.50238 8.5061 2.39347 9.573 2.60568C10.6399 2.8179 11.6199 3.34173 12.3891 4.11092C13.1583 4.88011 13.6821 5.86011 13.8943 6.92701C14.1065 7.9939 13.9976 9.09977 13.5813 10.1048C13.1651 11.1098 12.4601 11.9687 11.5556 12.5731C10.6512 13.1774 9.5878 13.5 8.5 13.5V15C9.88447 15 11.2378 14.5895 12.389 13.8203C13.5401 13.0511 14.4373 11.9579 14.9672 10.6788C15.497 9.3997 15.6356 7.99224 15.3655 6.63437C15.0954 5.2765 14.4287 4.02922 13.4497 3.05026C12.4708 2.07129 11.2235 1.4046 9.86563 1.13451Z"
                fill="white"
              />
            </svg>
          )}
          {[
            "intro_refunded",
            "autorenew_disabled",
            "subscription_refunded",
            "billing_issue",
            "trial_canceled",
            "subscription_canceled"
          ].indexOf(event.kind) > -1 && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.86563 1.13451C8.50777 0.86441 7.1003 1.00303 5.82122 1.53285C4.54213 2.06266 3.44888 2.95987 2.67971 4.11101C1.91054 5.26215 1.5 6.61553 1.5 8L0.25 8L2.25 10.5L4.25 8L3 8C3 6.9122 3.32257 5.84884 3.92692 4.94437C4.53127 4.0399 5.39025 3.33495 6.39524 2.91867C7.40024 2.50238 8.5061 2.39347 9.573 2.60568C10.6399 2.8179 11.6199 3.34173 12.3891 4.11092C13.1583 4.88011 13.6821 5.86011 13.8943 6.92701C14.1065 7.9939 13.9976 9.09977 13.5813 10.1048C13.1651 11.1098 12.4601 11.9687 11.5556 12.5731C10.6512 13.1774 9.5878 13.5 8.5 13.5V15C9.88447 15 11.2378 14.5895 12.389 13.8203C13.5401 13.0511 14.4373 11.9579 14.9672 10.6788C15.497 9.3997 15.6356 7.99224 15.3655 6.63437C15.0954 5.2765 14.4287 4.02922 13.4497 3.05026C12.4708 2.07129 11.2235 1.4046 9.86563 1.13451Z"
                fill="white"
              />
              <rect
                x="6.37868"
                y="6.99332"
                width="1"
                height="5"
                transform="rotate(-45 6.37868 6.99332)"
                fill="white"
              />
              <rect
                x="6.37868"
                y="9.82175"
                width="5"
                height="1"
                transform="rotate(-45 6.37868 9.82175)"
                fill="white"
              />
            </svg>
          )}
          {event.kind === "non_renewing_purchase_refunded" && (
            <svg
              width="24"
              height="26"
              viewBox="0 0 24 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 8H22L24 26H0L2 8Z" fill="white" />
              <path
                d="M18 6C18 5.21207 17.8448 4.43185 17.5433 3.7039C17.2417 2.97595 16.7998 2.31451 16.2426 1.75736C15.6855 1.20021 15.0241 0.758251 14.2961 0.456723C13.5681 0.155195 12.7879 -3.44416e-08 12 0C11.2121 3.44416e-08 10.4319 0.155195 9.7039 0.456723C8.97595 0.758251 8.31451 1.20021 7.75736 1.75736C7.20021 2.31451 6.75825 2.97595 6.45672 3.7039C6.15519 4.43185 6 5.21207 6 6L9 6C9 5.60603 9.0776 5.21593 9.22836 4.85195C9.37913 4.48797 9.6001 4.15726 9.87868 3.87868C10.1573 3.6001 10.488 3.37913 10.8519 3.22836C11.2159 3.0776 11.606 3 12 3C12.394 3 12.7841 3.0776 13.1481 3.22836C13.512 3.37913 13.8427 3.6001 14.1213 3.87868C14.3999 4.15726 14.6209 4.48797 14.7716 4.85195C14.9224 5.21593 15 5.60603 15 6H18Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5857 16.8427L7.75732 19.671L9.17154 21.0853L11.9999 18.2569L14.8284 21.0854L16.2426 19.6712L13.4141 16.8427L16.2426 14.0142L14.8284 12.6L11.9999 15.4285L9.17154 12.6001L7.75732 14.0143L10.5857 16.8427Z"
                fill="#FF0C46"
              />
            </svg>
          )}
          {event.kind === "trial_started" && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 3C0 2.44772 0.447715 2 1 2H15C15.5523 2 16 2.44772 16 3V6C14.8954 6 14 6.89543 14 8C14 9.10457 14.8954 10 16 10V13C16 13.5523 15.5523 14 15 14H1C0.447715 14 0 13.5523 0 13V10C1.10457 10 2 9.10457 2 8C2 6.89543 1.10457 6 0 6V3ZM4.5 4H5.5V12H4.5V4ZM11 4H6V9H11C11.5523 9 12 8.55228 12 8V5C12 4.44772 11.5523 4 11 4Z"
                fill="white"
              />
            </svg>
          )}
          {event.kind === "trial_expired" && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 3C0 2.44772 0.447715 2 1 2H15C15.5523 2 16 2.44772 16 3V6C14.8954 6 14 6.89543 14 8C14 9.10457 14.8954 10 16 10V13C16 13.5523 15.5523 14 15 14H1C0.447715 14 0 13.5523 0 13V10C1.10457 10 2 9.10457 2 8C2 6.89543 1.10457 6 0 6V3ZM4.5 4H5.5V12H4.5V4ZM11 4H6V9H11C11.5523 9 12 8.55228 12 8V5C12 4.44772 11.5523 4 11 4ZM8 6H7V7H8V8H9V7H10V8H11V7H10V6H11V5H10V6H9V5H8V6ZM8 6H9V7H8V6Z"
                fill="white"
              />
            </svg>
          )}
          {["subscription_expired", "intro_expired"].indexOf(event.kind) >
            -1 && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.86563 1.13451C8.50777 0.86441 7.1003 1.00303 5.82122 1.53285C4.54213 2.06266 3.44888 2.95987 2.67971 4.11101C1.91054 5.26215 1.5 6.61553 1.5 8L0.25 8L2.25 10.5L4.25 8L3 8C3 6.9122 3.32257 5.84884 3.92692 4.94437C4.53127 4.0399 5.39025 3.33495 6.39524 2.91867C7.40024 2.50238 8.5061 2.39347 9.573 2.60568C10.6399 2.8179 11.6199 3.34173 12.3891 4.11092C13.1583 4.88011 13.6821 5.86011 13.8943 6.92701C14.1065 7.9939 13.9976 9.09977 13.5813 10.1048C13.1651 11.1098 12.4601 11.9687 11.5556 12.5731C10.6512 13.1774 9.5878 13.5 8.5 13.5V15C9.88447 15 11.2378 14.5895 12.389 13.8203C13.5401 13.0511 14.4373 11.9579 14.9672 10.6788C15.497 9.3997 15.6356 7.99224 15.3655 6.63437C15.0954 5.2765 14.4287 4.02922 13.4497 3.05026C12.4708 2.07129 11.2235 1.4046 9.86563 1.13451Z"
                fill="white"
              />
              <rect x="5.5" y="5" width="1" height="7" fill="white" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 5H11C11.5523 5 12 5.44772 12 6V8C12 8.55228 11.5523 9 11 9H7V5ZM7.5 6H8.5V7H7.5V6ZM9.5 7V8H8.5V7H9.5ZM10.5 7V6H9.5V7H10.5ZM10.5 7V8H11.5V7H10.5Z"
                fill="white"
              />
            </svg>
          )}
          {["autorenew_enabled", "billing_issue_resolved"].indexOf(event.kind) >
            -1 && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.86563 1.13451C8.50777 0.86441 7.1003 1.00303 5.82122 1.53285C4.54213 2.06266 3.44888 2.95987 2.67971 4.11101C1.91054 5.26215 1.5 6.61553 1.5 8L0.25 8L2.25 10.5L4.25 8L3 8C3 6.9122 3.32257 5.84884 3.92692 4.94437C4.53127 4.0399 5.39025 3.33495 6.39524 2.91867C7.40024 2.50238 8.5061 2.39347 9.573 2.60568C10.6399 2.8179 11.6199 3.34173 12.3891 4.11092C13.1583 4.88011 13.6821 5.86011 13.8943 6.92701C14.1065 7.9939 13.9976 9.09977 13.5813 10.1048C13.1651 11.1098 12.4601 11.9687 11.5556 12.5731C10.6512 13.1774 9.5878 13.5 8.5 13.5V15C9.88447 15 11.2378 14.5895 12.389 13.8203C13.5401 13.0511 14.4373 11.9579 14.9672 10.6788C15.497 9.3997 15.6356 7.99224 15.3655 6.63437C15.0954 5.2765 14.4287 4.02922 13.4497 3.05026C12.4708 2.07129 11.2235 1.4046 9.86563 1.13451Z"
                fill="white"
              />
              <path d="M6.5 7.90753L8 9.40753L11 6.40753" stroke="white" />
            </svg>
          )}
        </div>
        <div className="user-feed__item-date uppercase">
          {this.yearIsDifferent(event.created_at) ? (
            <Moment format="MMM DD, Y, HH:mm" date={event.created_at} />
          ) : (
            <Moment format="MMM DD, Y, HH:mm" date={event.created_at} />
          )}
        </div>
        <span className="user-feed__item-title">
          {["intro_started", "trial_started"].indexOf(event.kind) > -1 &&
          this.getDuration(event) ? (
              <span className="user-feed__item-title__light">
                {this.getDuration(event)}{" "}
                {this.toLowerFirstLetter(titleize(event.kind).replace(/_/g, " "))}
              </span>
            ) : (
              <span>{titleize(event.kind).replace(/_/g, " ")}</span>
            )}
        </span>
        {this.showRevenue(event) && (
          <Aux>
            {this.props.customer.currency &&
              this.props.customer.currency.code !== "USD" && (
              <div
                className={
                  "user-feed__item-description__revenue " +
                    (event.receipt.price_usd < 0 && " text-red")
                }
              >
                {event.receipt.price_usd > 0 ? "+" : ""}{" "}
                {parseFloat(event.receipt.price).toFixed(2)}{" "}
                {this.props.customer.currency.code} ~ $
                {parseFloat(Math.abs(event.receipt.price_usd)).toFixed(2)}
              </div>
            )}
            {((this.props.customer.currency &&
              this.props.customer.currency.code === "USD") ||
              !this.props.customer.currency) && (
              <div
                className={
                  "user-feed__item-description__revenue " +
                  (event.receipt.price_usd < 0 && " text-red")
                }
              >
                {event.receipt.price_usd > 0 ? "+" : "-"} $
                {parseFloat(Math.abs(event.receipt.price_usd)).toFixed(2)}
              </div>
            )}
          </Aux>
        )}
        <div className="user-feed__item-description">
          <div className="user-feed__item-bottom__info">
            {event.properties && event.properties.reason && (
              <div className="user-feed__item-bottom__info-item">
                <svg
                  className="va-middle"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.5 5C8.32843 5 9 4.32843 9 3.5C9 2.67157 8.32843 2 7.5 2C6.67157 2 6 2.67157 6 3.5C6 4.32843 6.67157 5 7.5 5ZM9 7V6H6V8H7V12H5V14H11V12H9V8V7Z"
                    fill="#FF0C46"
                  />
                </svg>
                <span className="va-middle text-red">
                  {event.properties.reason.replace(/_/g, " ")}
                </span>
              </div>
            )}
            {event.receipt && event.receipt.promo_offer_id && (
              <div className="user-feed__item-bottom__info-item">
                <svg
                  className="va-middle"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.20729 2.25734L12.4499 2.25734C13.0022 2.25734 13.4499 2.70505 13.4499 3.25734L13.4499 7.49998C13.4499 7.76519 13.3446 8.01955 13.157 8.20708L6.37887 14.9853C5.98834 15.3758 5.35518 15.3758 4.96465 14.9853L0.722011 10.7426C0.331487 10.3521 0.331488 9.71893 0.722011 9.3284L7.50019 2.55023C7.68772 2.36269 7.94208 2.25734 8.20729 2.25734ZM9.20729 6.49998C9.79308 7.08576 10.7428 7.08576 11.3286 6.49998C11.9144 5.91419 11.9144 4.96444 11.3286 4.37866C10.7428 3.79287 9.79308 3.79287 9.20729 4.37866C8.62151 4.96444 8.62151 5.91419 9.20729 6.49998Z"
                    fill="#97ADC6"
                  />
                </svg>
                <span className="va-middle">
                  {event.receipt.promo_offer_id}
                </span>
              </div>
            )}
            {event.kind.indexOf("_refunded") > -1 &&
            event.properties &&
            event.properties.product_id ? (
                <div className="user-feed__item-bottom__info-item">
                  <svg
                    className="va-middle"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 7L14 3.92995L8.27454 1.06492C8.09983 0.978359 7.90084 0.978359 7.72681 1.06492L2 3.92995L8 7Z"
                      fill="#97ADC6"
                    />
                    <path
                      d="M7.5 7.61183L1 5V11.0313C1 11.2841 1.16756 11.5127 1.429 11.6148L7.5 14V7.61183Z"
                      fill="#97ADC6"
                    />
                    <path
                      d="M8.5 7.61165V14L14.571 11.615C14.8324 11.5122 15 11.283 15 11.0309V5L8.5 7.61165Z"
                      fill="#97ADC6"
                    />
                  </svg>
                  <span className="va-middle">{event.properties.product_id}</span>
                </div>
              ) : event.receipt && event.receipt.product ? (
                <div className="user-feed__item-bottom__info-item">
                  <svg
                    className="va-middle"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 7L14 3.92995L8.27454 1.06492C8.09983 0.978359 7.90084 0.978359 7.72681 1.06492L2 3.92995L8 7Z"
                      fill="#97ADC6"
                    />
                    <path
                      d="M7.5 7.61183L1 5V11.0313C1 11.2841 1.16756 11.5127 1.429 11.6148L7.5 14V7.61183Z"
                      fill="#97ADC6"
                    />
                    <path
                      d="M8.5 7.61165V14L14.571 11.615C14.8324 11.5122 15 11.283 15 11.0309V5L8.5 7.61165Z"
                      fill="#97ADC6"
                    />
                  </svg>
                  <span className="va-middle">
                    {event.receipt.product.product_id}
                  </span>
                </div>
              ) : (
                <div />
              )}
            {event.receipt && event.receipt.transaction_id && (
              <div className="user-feed__item-bottom__info-item">
                <svg
                  className="va-middle"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 1L5.5 2L8 1L10.5 2L13 1V15L10.5 14L8 15L5.5 14L3 15V1Z"
                    fill="#97ADC6"
                  />
                </svg>
                <span className="va-middle">
                  {event.receipt.transaction_id}
                </span>
              </div>
            )}
            {event.integrations_sent &&
              Object.keys(event.integrations_sent).length > 0 && (
              <UserFeedItemsIntegrationsStatus
                appId={appId}
                event={event}
                integrationsSent={event.integrations_sent}
              />
            )}
            {/* currentSubscription.intro_offer_info && currentSubscription.intro_offer_info.unit ? (
              <div className="user-feed__item-bottom__info-item">
                <svg className="va-middle" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0)">
                    <rect x="7" y="3" width="4" height="2" fill="#97ADC6"/>
                    <rect x="7" y="2" width="2" height="3" fill="#97ADC6"/>
                    <rect x="7" y="11" width="2" height="3" fill="#97ADC6"/>
                    <rect x="5" y="11" width="4" height="2" fill="#97ADC6"/>
                    <rect x="7" y="7" width="2" height="2" fill="#97ADC6"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.87868 8.12132C5.44129 8.68393 6.20435 9 7 9L7 7C6.44772 7 6 6.55228 6 6C6 5.44772 6.44772 5 7 5V3C6.20435 3 5.44129 3.31607 4.87868 3.87868C4.31607 4.44129 4 5.20435 4 6C4 6.79565 4.31607 7.55871 4.87868 8.12132Z" fill="#97ADC6"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.1213 7.87868C10.5587 7.31607 9.79565 7 9 7L9 9C9.55228 9 10 9.44772 10 10C10 10.5523 9.55228 11 9 11V13C9.79565 13 10.5587 12.6839 11.1213 12.1213C11.6839 11.5587 12 10.7956 12 10C12 9.20435 11.6839 8.44129 11.1213 7.87868Z" fill="#97ADC6"/>
                    </g>
                    <defs>
                    <clipPath id="clip0">
                    <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="va-middle">${parseFloat(currentSubscription.intro_offer_info.price).toFixed(2)} / {currentSubscription.intro_offer_info.unit}</span>
              </div>
              ) :
              ("")
            */}
          </div>
        </div>
      </div>
    ))
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UserFeedItems)
