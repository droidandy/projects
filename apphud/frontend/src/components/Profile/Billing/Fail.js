import React from "react"
import { NavLink } from "react-router-dom"
import errorImage from "../../../assets/images/image-fatal_error.jpg"

class Fail extends React.Component {
  render() {
    return (
      <div className="ta-center input-wrapper">
        <img src={errorImage} width="350px" />
        <div>
          <NavLink
            className="button button_225 button_green button_inline-block"
            to="/profile/billing/update-payment-method"
          >
            Update payment details
          </NavLink>
        </div>
      </div>
    )
  }
}

export default Fail
