import React from "react"
import { NavLink } from "react-router-dom"
import history from "../history"
import classNames from "classnames"
import {track} from "../libs/helpers";

class ReachLimitPanel extends React.Component {
  render() {
    const { user_collaboration, user } = this.props.application

    return (
      <div className="billing-panel__wrapper">
        {user_collaboration && (
          <div className="billing-panel">
            {user_collaboration.role === "owner" ? (
              <span>You reached {this.props.planName} plan MTR limit</span>
            ) : (
              <span>
                You reached Free plan MTR limit. Please, ask app owner{" "}
                <b>
                  (
                  <a className="nolink-inline" href={`mailto:${user.email}`}>
                    {user.email}
                  </a>
                  )
                </b>{" "}
                to upgrade plan.
              </span>
            )}
            <NavLink
                onClick={() => track("team_invite_upgrade_popup_submitted")}
              style={
                user_collaboration.role === "owner"
                  ? {}
                  : { visibility: "hidden" }
              }
              className="button button_white text-red button_160 va-middle button_inline-block"
              to="/profile/billing/change-plan"
            >
              Upgrade plan{" "}
            </NavLink>
          </div>
        )}
      </div>
    )
  }
}

export default ReachLimitPanel
