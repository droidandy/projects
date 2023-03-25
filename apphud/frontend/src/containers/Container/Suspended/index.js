import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import cosmonautImage from "../../../assets/images/pushrules2.png"

class Suspended extends Component {
  render() {
    const { user_collaboration, user } = this.props.application

    return (
      <div className="container-content container-content__white container-content_pb150">
        {user_collaboration && (
          <div style={{ padding: "20px 30px" }} className="upgrade-plan__modal">
            <div className="ta-center">
              <img src={cosmonautImage} width="350px" height="226px" />
            </div>
            {user_collaboration.role === "owner" ? (
              <div className="ta-left">
                <div className="upgrade-plan__modal-title ta-center">
                  You account has been suspended
                </div>
              </div>
            ) : (
              <div className="ta-left">
                <div className="upgrade-plan__modal-title ta-center">
                  Owner’s account has been suspended
                </div>
              </div>
            )}
            <ul className="upgrade-plan__modal-list upgrade-plan__modal-list_suspended">
              {user_collaboration.role === "owner" ? (
                <div className="upgrade-plan__modal-description ta-left">
                  We temporarily suspended your account. Please upgrade plan.
                </div>
              ) : (
                <div className="upgrade-plan__modal-description ta-left">
                  We temporarily suspended this app owner’s account. Please ask
                  app owner{" "}
                  <b>
                    (
                    <a className="nolink-inline" href={`mailto:${user.email}`}>
                      {user.email}
                    </a>
                    )
                  </b>{" "}
                  to upgrade plan.
                </div>
              )}
              <li className="upgrade-plan__modal-list__item">
                <svg
                    className="va-middle"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.0711 4.92893C22.9764 8.83417 22.9764 15.1658 19.0711 19.0711C15.1659 22.9763 8.83422 22.9763 4.92898 19.0711C1.02373 15.1658 1.02373 8.83418 4.92898 4.92893C8.83422 1.02369 15.1659 1.02369 19.0711 4.92893ZM10.5858 12L7.7574 9.17157L9.17162 7.75736L12 10.5858L14.8285 7.75736L16.2427 9.17157L13.4143 12L16.2427 14.8284L14.8285 16.2426L12 13.4142L9.17162 16.2426L7.7574 14.8284L10.5858 12Z"
                      fill="#FF0C46"
                  />
                </svg>
                <span className="va-middle">
                  We <mark className="text-red">have stopped</mark> updating user subscription state in Apphud SDK.
                </span>
              </li>
              <li className="upgrade-plan__modal-list__item">
                <svg
                  className="va-middle"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.0711 4.92893C22.9764 8.83417 22.9764 15.1658 19.0711 19.0711C15.1659 22.9763 8.83422 22.9763 4.92898 19.0711C1.02373 15.1658 1.02373 8.83418 4.92898 4.92893C8.83422 1.02369 15.1659 1.02369 19.0711 4.92893ZM10.5858 12L7.7574 9.17157L9.17162 7.75736L12 10.5858L14.8285 7.75736L16.2427 9.17157L13.4143 12L16.2427 14.8284L14.8285 16.2426L12 13.4142L9.17162 16.2426L7.7574 14.8284L10.5858 12Z"
                    fill="#FF0C46"
                  />
                </svg>
                <span className="va-middle">
                  Integrations and webhooks{" "}
                  <mark className="text-red">are disabled</mark>
                </span>
              </li>
              <li className="upgrade-plan__modal-list__item">
                <svg
                  className="va-middle"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.0711 4.92893C22.9764 8.83417 22.9764 15.1658 19.0711 19.0711C15.1659 22.9763 8.83422 22.9763 4.92898 19.0711C1.02373 15.1658 1.02373 8.83418 4.92898 4.92893C8.83422 1.02369 15.1659 1.02369 19.0711 4.92893ZM10.5858 12L7.7574 9.17157L9.17162 7.75736L12 10.5858L14.8285 7.75736L16.2427 9.17157L13.4143 12L16.2427 14.8284L14.8285 16.2426L12 13.4142L9.17162 16.2426L7.7574 14.8284L10.5858 12Z"
                    fill="#FF0C46"
                  />
                </svg>

                <span className="va-middle">
                  Rules <mark className="text-red">are disabled</mark>
                </span>
              </li>
              <li className="upgrade-plan__modal-list__item">
                <svg
                  className="va-middle"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.0711 4.92893C22.9764 8.83417 22.9764 15.1658 19.0711 19.0711C15.1659 22.9763 8.83422 22.9763 4.92898 19.0711C1.02373 15.1658 1.02373 8.83418 4.92898 4.92893C8.83422 1.02369 15.1659 1.02369 19.0711 4.92893ZM10.5858 12L7.7574 9.17157L9.17162 7.75736L12 10.5858L14.8285 7.75736L16.2427 9.17157L13.4143 12L16.2427 14.8284L14.8285 16.2426L12 13.4142L9.17162 16.2426L7.7574 14.8284L10.5858 12Z"
                    fill="#FF0C46"
                  />
                </svg>

                <span className="va-middle">
                  Customers API <mark className="text-red">are disabled</mark>
                </span>
              </li>
            </ul>
            {user_collaboration.role === "owner" && (
              <div className="ta-center">
                <NavLink
                  to="/profile/billing/change-plan"
                  className="button button_green button_160 button_inline-block mt30"
                >
                  Upgrade plan
                </NavLink>
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Suspended)
