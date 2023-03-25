import React from "react"
import { NavLink } from "react-router-dom"
import history from "../history"
import classNames from "classnames"
import { connect } from "react-redux"
import CubeSVG from "../assets/icons/cubes.svg";
import {track} from "../libs/helpers";

class LeftBar extends React.Component {
  activeSettingsClassName = (className) => {
    return classNames("left-bar__nav-item__link", {
      "left-bar__nav-item__link_active":
        history.location.pathname.indexOf(
          `/apps/${this.props.match.params.appId}/settings`
        ) > -1,
    })
  }

  activeIntegrationsClassName = (className) => {
    return classNames("left-bar__nav-item__link", {
      "left-bar__nav-item__link_active":
        history.location.pathname.indexOf(
          `/apps/${this.props.match.params.appId}/integrations`
        ) > -1,
    })
  }

  activeChartsClassName = (className) => {
    return classNames("left-bar__nav-item__link", {
      "left-bar__nav-item__link_active":
        history.location.pathname.indexOf(
          `/apps/${this.props.match.params.appId}/charts`
        ) > -1,
    })
  }

  activeCohortsClassName = (className) => {
    return classNames("left-bar__nav-item__link", {
      "left-bar__nav-item__link_active":
        history.location.pathname.indexOf(
          `/apps/${this.props.match.params.appId}/cohorts`
        ) > -1,
    })
  }

  activeClassNameRules = (className) => {
    return classNames("left-bar__nav-item__link", {
      "left-bar__nav-item__link_active":
        history.location.pathname.indexOf(
          `/apps/${this.props.match.params.appId}/newrules`
        ) > -1,
    })
  }

  activeClassNameScreens = (className) => {
    return classNames("left-bar__nav-item__link", {
      "left-bar__nav-item__link_active":
        history.location.pathname.indexOf(
          `/apps/${this.props.match.params.appId}/screens`
        ) > -1,
    })
  }

  activeClassNameProductHub = (className) => {
    return classNames("left-bar__nav-item__link", {
      "left-bar__nav-item__link_active":
          history.location.pathname.indexOf(
              `/apps/${this.props.match.params.appId}/product_hub`
          ) > -1,
    })
  }

  render() {
    const {
      rules,
      show_analytics,
      user_collaboration,
      application_user,
    } = this.props

    return application_user ? (
      <div
        className={
          "left-bar " +
          (application_user.status === "suspended" && " left-bar_disabled")
        }
      >
        <NavLink
          className="left-bar__title"
          to={`/apps/${this.props.match.params.appId}/users`}
        >
          <svg
            className="va-top"
            width="111"
            height="30"
            viewBox="0 0 111 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.0688 10.25C12.2288 8.78 10.3388 7.85 8.35879 7.85C4.03879 7.82 0.648789 10.49 0.648789 15.59C0.648789 20.78 3.88879 23.48 8.26879 23.45C9.91879 23.42 12.2288 22.58 13.0688 20.84L13.2488 23H16.6988V8.21H13.1888L13.0688 10.25ZM8.68879 11.12C14.4488 11.12 14.4488 20.09 8.68879 20.09C6.25879 20.09 4.30879 18.41 4.30879 15.59C4.30879 12.77 6.25879 11.12 8.68879 11.12ZM27.9886 19.82C25.4986 19.82 23.7886 17.93 23.7886 15.62C23.7886 13.31 25.3486 11.42 27.9886 11.42C30.6286 11.42 32.1886 13.31 32.1886 15.62C32.1886 17.93 30.4786 19.82 27.9886 19.82ZM23.4586 29.18V21.26C24.5086 22.88 26.8186 23.36 28.3786 23.36C33.1186 23.36 35.8486 19.94 35.8486 15.62C35.8486 11.27 32.8186 7.88 28.2586 7.88C26.5786 7.88 24.5986 8.6 23.4586 10.25L23.2186 8.21H19.7986V29.18H23.4586ZM46.7386 19.82C44.2486 19.82 42.5386 17.93 42.5386 15.62C42.5386 13.31 44.0986 11.42 46.7386 11.42C49.3786 11.42 50.9386 13.31 50.9386 15.62C50.9386 17.93 49.2286 19.82 46.7386 19.82ZM42.2086 29.18V21.26C43.2586 22.88 45.5686 23.36 47.1286 23.36C51.8686 23.36 54.5986 19.94 54.5986 15.62C54.5986 11.27 51.5686 7.88 47.0086 7.88C45.3286 7.88 43.3486 8.6 42.2086 10.25L41.9686 8.21H38.5486V29.18H42.2086ZM57.2986 2V23H60.9586V15.44C60.9586 13.22 62.4586 11.39 64.6186 11.39C66.5686 11.39 67.9786 12.53 67.9786 15.23V23H71.6386V15.2C71.6386 10.85 69.7786 8 65.5786 8C63.8986 8 62.2786 8.51 60.9586 10.22V2H57.2986ZM74.5273 8.21V15.98C74.5273 20.57 77.1073 23.24 80.6473 23.24C82.7173 23.24 84.1273 22.52 85.6573 21.02L85.8973 23.03H89.1673V8.21H85.5373V15.77C85.5373 18.02 84.0073 19.91 81.7573 19.91C79.4173 19.91 78.1873 18.2 78.1873 15.95V8.21H74.5273ZM99.5663 11.27C101.876 11.27 103.856 13.01 103.856 15.59C103.856 18.26 101.876 19.94 99.5663 19.94C97.2263 19.94 95.3663 18.17 95.3663 15.59C95.3663 12.92 97.2263 11.27 99.5663 11.27ZM104.096 2.03V10.22C103.226 8.69 100.796 7.85 99.2363 7.85C94.9163 7.85 91.7063 10.49 91.7063 15.59C91.7063 20.45 94.9763 23.33 99.3263 23.33C101.126 23.33 102.956 22.73 104.096 20.96L104.336 23H107.756V2.03H104.096Z"
              fill="white"
            />
          </svg>
        </NavLink>
        {user_collaboration && (
          <ul className="left-bar__nav">
            {show_analytics && (
              <li className="left-bar__nav-item">
                <NavLink
                  to={`/apps/${this.props.match.params.appId}/dashboard`}
                  activeClassName="left-bar__nav-item__link_active"
                  className="left-bar__nav-item__link"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.257 9.893L11.525 15.019C8.693 15.106 6.008 15.96 3.673 17.526C2.618 15.942 2 14.042 2 12C2 6.486 6.486 2 12 2C17.514 2 22 6.486 22 12C22 14.043 21.382 15.943 20.326 17.526C18.146 16.065 15.661 15.218 13.037 15.041L13.742 10.105L12.257 9.893ZM19 12C19 11.447 18.552 11 18 11C17.448 11 17 11.447 17 12C17 12.553 17.448 13 18 13C18.552 13 19 12.553 19 12ZM17 8C17 7.447 16.552 7 16 7C15.448 7 15 7.447 15 8C15 8.553 15.448 9 16 9C16.552 9 17 8.553 17 8ZM13 6C13 5.447 12.552 5 12 5C11.448 5 11 5.447 11 6C11 6.553 11.448 7 12 7C12.552 7 13 6.553 13 6ZM9 8C9 7.447 8.552 7 8 7C7.448 7 7 7.447 7 8C7 8.553 7.448 9 8 9C8.552 9 9 8.553 9 8ZM7 12C7 11.447 6.552 11 6 11C5.448 11 5 11.447 5 12C5 12.553 5.448 13 6 13C6.552 13 7 12.553 7 12ZM4.946 19.081C7.045 17.718 9.46 17 12 17C14.539 17 16.956 17.717 19.055 19.08C17.245 20.883 14.751 22 12 22C9.25 22 6.756 20.885 4.946 19.081Z"
                      fill="white"
                    />
                  </svg>
                  <span>Dashboard</span>
                </NavLink>
              </li>
            )}
            {show_analytics && (
              <li className="left-bar__nav-item">
                <NavLink
                  to={`/apps/${this.props.match.params.appId}/charts/proceeds`}
                  className={this.activeChartsClassName()}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5 3V19H21V21H4C3.448 21 3 20.553 3 20V3H5ZM13.293 14.7079L11 12.4149L7.707 15.7069L6.293 14.2929L10.293 10.2929C10.684 9.90295 11.316 9.90295 11.707 10.2929L14 12.5859L19.293 7.29395L20.707 8.70795L14.707 14.7079C14.316 15.0989 13.684 15.0989 13.293 14.7079Z"
                      fill="white"
                    />
                  </svg>
                  <span>Charts</span>
                </NavLink>
              </li>
            )}
            {show_analytics && (
              <li className="left-bar__nav-item">
                <NavLink
                  to={`/apps/${this.props.match.params.appId}/cohorts/subscribers_retention`}
                  className={this.activeCohortsClassName()}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 3.5H2V5.499H22V3.5Z" fill="white"/>
                    <path d="M17 8.49902H2V10.499H17V8.49902Z" fill="white"/>
                    <path d="M12 13.499H2V15.499H12V13.499Z" fill="white"/>
                    <path d="M7 18.499H2V20.499H7V18.499Z" fill="white"/>
                  </svg>
                  <span>Cohorts</span>
                  <span className="dot" />
                </NavLink>
              </li>
            )}
            <li className="left-bar__nav-item">
              <NavLink
                to={`/apps/${this.props.match.params.appId}/users`}
                activeClassName="left-bar__nav-item__link_active"
                className="left-bar__nav-item__link"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 12C12.7614 12 15 9.76142 15 7C15 4.23858 12.7614 2 10 2C7.23858 2 5 4.23858 5 7C5 9.76142 7.23858 12 10 12ZM15.6569 15.3431C17.1571 16.8434 18 18.8783 18 21H10L2 21C2 18.8783 2.84286 16.8434 4.34315 15.3431C5.84344 13.8429 7.87827 13 10 13C12.1217 13 14.1566 13.8429 15.6569 15.3431ZM20 9C20 10.1046 19.1046 11 18 11C16.8954 11 16 10.1046 16 9C16 7.89543 16.8954 7 18 7C19.1046 7 20 7.89543 20 9ZM17.6164 14.4408C18.3098 15.1845 18.8586 16.0543 19.2434 17H23C23 15.6739 22.5088 14.4021 21.6346 13.4645C20.7603 12.5268 19.5745 12 18.3381 12C17.3712 12 16.4352 12.3222 15.655 12.9111C16.3729 13.3042 17.0358 13.8181 17.6164 14.4408Z"
                    fill="white"
                  />
                </svg>
                <span>Users</span>
              </NavLink>
            </li>
            <li className="left-bar__nav-item">
              <NavLink
                to={`/apps/${this.props.match.params.appId}/events`}
                activeClassName="left-bar__nav-item__link_active"
                className="left-bar__nav-item__link"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.938 4.938C6.779 3.089 9.285 2 12 2C17.514 2 22 6.485 22 12C22 17.515 17.514 22 12 22V20C16.411 20 20 16.411 20 12C20 7.589 16.411 4 12 4C9.828 4 7.824 4.871 6.351 6.351L9 9H3V3L4.938 4.938ZM11 14V8H13V12H15V14H11Z"
                    fill="white"
                  />
                </svg>
                <span>Events</span>
              </NavLink>
            </li>
            <li className="left-bar__nav-item">
              <NavLink
                to={`/apps/${this.props.match.params.appId}/newrules/all`}
                className={this.activeClassNameRules()}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.707 10.707L23.414 7L19.707 3.293L18.293 4.707L19.586 6H17C13.095 6 12.057 7.489 11.142 8.803C10.32 9.982 9.611 11 6 11H0V13H6C9.611 13 10.32 14.018 11.142 15.197C12.057 16.511 13.095 18 17 18H19.586L18.293 19.293L19.707 20.707L23.414 17L19.707 13.293L18.293 14.707L19.586 16H17C14.139 16 13.57 15.184 12.783 14.054C12.304 13.367 11.767 12.596 10.754 12C11.768 11.404 12.305 10.633 12.783 9.946C13.57 8.816 14.139 8 17 8H19.586L18.293 9.293L19.707 10.707Z"
                    fill="white"
                  />
                </svg>
                <span>Rules</span>
              </NavLink>
            </li>
            <li className="left-bar__nav-item">
              <NavLink
                to={`/apps/${this.props.match.params.appId}/screens/all`}
                className={this.activeClassNameScreens()}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5 2C5 0.89543 5.89543 0 7 0H17C18.1046 0 19 0.895431 19 2V22C19 23.1046 18.1046 24 17 24H7C5.89543 24 5 23.1046 5 22V2ZM7 3C7 2.44772 7.44772 2 8 2H9C9 2.55228 9.44772 3 10 3H14C14.5523 3 15 2.55228 15 2H16C16.5523 2 17 2.44772 17 3V21C17 21.5523 16.5523 22 16 22H8C7.44772 22 7 21.5523 7 21V3Z"
                    fill="white"
                  />
                </svg>
                <span>Screens</span>
              </NavLink>
            </li>
            <li className="left-bar__nav-item">
              <NavLink
                  to={`/apps/${this.props.match.params.appId}/product_hub/products`}
                  className={this.activeClassNameProductHub()}>
                <img src={CubeSVG} />
                <span>Product Hub</span>
              </NavLink>
            </li>
            <li className="left-bar__nav-item">
              <NavLink
                to={`/apps/${this.props.match.params.appId}/integrations/ios`}
                activeClassName="left-bar__nav-item__link_active"
                className={this.activeIntegrationsClassName()}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14 2H16V5H18C19.6569 5 21 6.34315 21 8H3C3 6.34315 4.34315 5 6 5H8V2H10V5H14V2ZM21 10C21 12.387 20.0518 14.6761 18.364 16.364C16.9135 17.8144 15.019 18.7186 13 18.9443V22H11V18.9443C8.98098 18.7186 7.08647 17.8144 5.63604 16.364C3.94821 14.6761 3 12.387 3 10L12 10H21Z"
                    fill="white"
                  />
                </svg>
                <span>Integrations</span>
              </NavLink>
            </li>
            <li className="left-bar__nav-item">
              <a
                target="blank"
                href="https://apphud.upvoty.com/b/feature-requests/"
                className="left-bar__nav-item__link"
                onClick={() => track("feature_request_link_clicked")}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.99799 22V18H3.99799C2.89499 18 1.99799 17.103 1.99799 16V4C1.99799 2.896 2.89499 2 3.99799 2H19.998C21.101 2 21.998 2.896 21.998 4V16C21.998 17.103 21.101 18 19.998 18H11.331L5.99799 22ZM3.99799 4V16H7.99799V18L10.665 16H19.998V4H3.99799Z" fill="white"/>
                  <path d="M8.99799 6H6.99799V14H8.99799V6Z" fill="white"/>
                  <path d="M12.998 10H10.998V14H12.998V10Z" fill="white"/>
                  <path d="M16.998 8H14.998V14H16.998V8Z" fill="white"/>
                </svg>
                <span>Feature request</span>
                <span className="dot" />
              </a>
            </li>
            <li className="left-bar__nav-item">
              <NavLink
                to={`/apps/${this.props.match.params.appId}/settings/general`}
                className={this.activeSettingsClassName()}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12C19.5 11.66 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.97 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.72 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.28 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98ZM12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5Z"
                    fill="white"
                  />
                </svg>
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    ) : (
      <div className="left-bar">
        <NavLink
          className="left-bar__title"
          to={`/apps/${this.props.match.params.appId}/users`}
        >
          <svg
            className="va-top"
            width="111"
            height="30"
            viewBox="0 0 111 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.0688 10.25C12.2288 8.78 10.3388 7.85 8.35879 7.85C4.03879 7.82 0.648789 10.49 0.648789 15.59C0.648789 20.78 3.88879 23.48 8.26879 23.45C9.91879 23.42 12.2288 22.58 13.0688 20.84L13.2488 23H16.6988V8.21H13.1888L13.0688 10.25ZM8.68879 11.12C14.4488 11.12 14.4488 20.09 8.68879 20.09C6.25879 20.09 4.30879 18.41 4.30879 15.59C4.30879 12.77 6.25879 11.12 8.68879 11.12ZM27.9886 19.82C25.4986 19.82 23.7886 17.93 23.7886 15.62C23.7886 13.31 25.3486 11.42 27.9886 11.42C30.6286 11.42 32.1886 13.31 32.1886 15.62C32.1886 17.93 30.4786 19.82 27.9886 19.82ZM23.4586 29.18V21.26C24.5086 22.88 26.8186 23.36 28.3786 23.36C33.1186 23.36 35.8486 19.94 35.8486 15.62C35.8486 11.27 32.8186 7.88 28.2586 7.88C26.5786 7.88 24.5986 8.6 23.4586 10.25L23.2186 8.21H19.7986V29.18H23.4586ZM46.7386 19.82C44.2486 19.82 42.5386 17.93 42.5386 15.62C42.5386 13.31 44.0986 11.42 46.7386 11.42C49.3786 11.42 50.9386 13.31 50.9386 15.62C50.9386 17.93 49.2286 19.82 46.7386 19.82ZM42.2086 29.18V21.26C43.2586 22.88 45.5686 23.36 47.1286 23.36C51.8686 23.36 54.5986 19.94 54.5986 15.62C54.5986 11.27 51.5686 7.88 47.0086 7.88C45.3286 7.88 43.3486 8.6 42.2086 10.25L41.9686 8.21H38.5486V29.18H42.2086ZM57.2986 2V23H60.9586V15.44C60.9586 13.22 62.4586 11.39 64.6186 11.39C66.5686 11.39 67.9786 12.53 67.9786 15.23V23H71.6386V15.2C71.6386 10.85 69.7786 8 65.5786 8C63.8986 8 62.2786 8.51 60.9586 10.22V2H57.2986ZM74.5273 8.21V15.98C74.5273 20.57 77.1073 23.24 80.6473 23.24C82.7173 23.24 84.1273 22.52 85.6573 21.02L85.8973 23.03H89.1673V8.21H85.5373V15.77C85.5373 18.02 84.0073 19.91 81.7573 19.91C79.4173 19.91 78.1873 18.2 78.1873 15.95V8.21H74.5273ZM99.5663 11.27C101.876 11.27 103.856 13.01 103.856 15.59C103.856 18.26 101.876 19.94 99.5663 19.94C97.2263 19.94 95.3663 18.17 95.3663 15.59C95.3663 12.92 97.2263 11.27 99.5663 11.27ZM104.096 2.03V10.22C103.226 8.69 100.796 7.85 99.2363 7.85C94.9163 7.85 91.7063 10.49 91.7063 15.59C91.7063 20.45 94.9763 23.33 99.3263 23.33C101.126 23.33 102.956 22.73 104.096 20.96L104.336 23H107.756V2.03H104.096Z"
              fill="white"
            />
          </svg>
        </NavLink>
        <ul className="left-bar__nav">
          <div
            className="animated-background timeline-item"
            style={{
              opacity: 0.7,
              width: 154,
              height: "24px",
              marginTop: 42,
              marginLeft: 10,
            }}
          />
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    rules: state.rules,
    user_collaboration: state.application.user_collaboration,
    application_user: state.application.user,
    show_analytics: state.application.user_collaboration
      ? state.application.user_collaboration.show_analytics
      : true,
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(LeftBar)
