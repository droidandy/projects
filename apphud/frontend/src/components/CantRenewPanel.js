import React from "react"
import { NavLink } from "react-router-dom"
import history from "../history"
import classNames from "classnames"

class CantRenewPanel extends React.Component {
  render() {
    const { user_collaboration, user } = this.props.application

    return (
      <div className="billing-panel__wrapper">
        {user_collaboration && (
          <div className="billing-panel">
            {user_collaboration.role === "owner" ? (
              <span>We can’t renew your plan</span>
            ) : (
              <span>
                We can’t renew your plan. Please, ask app owner{" "}
                <b>
                  (
                  <a className="nolink-inline" href={`mailto:${user.email}`}>
                    {user.email}
                  </a>
                  )
                </b>{" "}
                to update payment method.
              </span>
            )}
            <NavLink
              style={
                user_collaboration.role === "owner"
                  ? {}
                  : { visibility: "hidden" }
              }
              className="button button_225 button_white text-red va-middle button_inline-block"
              to="/profile/billing/update-payment-method"
            >
              Update payment method
            </NavLink>
          </div>
        )}
      </div>
    )
  }
}

export default CantRenewPanel
