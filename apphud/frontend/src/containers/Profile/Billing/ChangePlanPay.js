import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import history from "../../../history"
import classNames from "classnames"
import { CardElement, Elements, injectStripe } from "react-stripe-elements"
import { NotificationManager } from "../../../libs/Notifications"
import axios from "axios"
import { fetchUserRequest } from "../../../actions/user"
import {track} from "../../../libs/helpers";

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        lineHeight: "normal",
        "-webkit-font-smoothing": "antialiased",
        fontFamily: "Ubuntu",
        "::placeholder": {
          color: "#aab7c4"
        },
        padding
      },
      invalid: {
        color: "#9e2146"
      }
    }
  }
}
const capitalize = (s) => {
  if (typeof s !== "string") return ""
  return s.charAt(0).toUpperCase() + s.slice(1)
}

class ChangePlanPay extends Component {
  state = {
    change: {
      complete: false
    },
    plan: {},
    removing: false,
    saving: false
  };

  handleCallbackAlert = (ok) => {
    if (ok) this.removePaymentMethod()

    this.setState({ alertOpen: false })
  };

  createPlan = () => {
    axios
      .post(`/billing/subscriptions?plan=${this.state.plan.id}`)
      .then(() => {
        this.setState({
          saving: false
        })
        // Success
        history.push("/profile/billing/success")
        this.props.fetchUserRequest()
      })
      .catch(() => {
        history.push("/profile/billing/fail")
      })
  };

  updatePlan = () => {
    axios
      .put(`/billing/subscriptions?plan=${this.state.plan.id}`)
      .then(() => {
        this.setState({
          saving: false
        })
        // Success
        history.push("/profile/billing/success")
        this.props.fetchUserRequest()
      })
      .catch(() => {
        history.push("/profile/billing/fail")
      })
  };

  createPaymentMethod = (source) => {
    const { user } = this.props
    const action = user.customer_id ? "put" : "post"

    axios[action](`/billing/payment_methods?source=${source}`)
      .then(() => {
        if (user.subscription.plan.free) this.createPlan()
        else this.updatePlan()
      })
      .catch(() => {
        history.push("/profile/billing/fail")
      })
  };

  onTokenReceived = ({ token }) => {
    this.createPaymentMethod(token.id)
  };

  handleSubmit = (ev) => {
    ev.preventDefault()
    const { stripe, user } = this.props
    track("profile_payment_method_updated")
    if (user.payment_method) {
      this.setState({ saving: true })

      if (this.props.user.subscription.plan.free) this.createPlan()
      else this.updatePlan()
    } else {
      if (stripe) {
        this.setState({ saving: true })
        stripe.createToken().then(this.onTokenReceived)
      } else {
        console.log("Stripe.js hasn't loaded yet.")
      }
    }
  };

  handleChange = (change) => {
    this.setState({ change })
  };

  getPlans = () => {
    axios.get("/billing/plans").then((response) => {
      const { results } = response.data.data
      const plan = results.find(
        ({ id }) => id === this.props.match.params.planId
      )
      this.setState({
        plan
      })
      document.getElementById("current-tab2").innerText = `${capitalize(
        plan.name
      )} plan`
    })
  };

  componentWillUnmount() {
    document.getElementById("current-tab2").innerText = ""
  }

  componentDidMount() {
    this.props.fetchUserRequest()
    this.getPlans()

    if (this.props.user.payment_method) { this.setState({ change: { complete: true } }) }
  }

  render() {
    const { change, saving, plan } = this.state
    const { payment_method } = this.props.user
    return (
      <div className="c-c__b-billing__update-payment-method">
        <form onSubmit={this.handleSubmit}>
          <div className="input-wrapper input-wrapper_mt30 ta-left">
            <label className="l-p__label" htmlFor="name">
              Card
            </label>
            {payment_method ? (
              <input
                type="text"
                className="input input_blue input_stretch"
                readOnly={true}
                placeholder={payment_method.payment_method}
              />
            ) : (
              <CardElement
                onChange={this.handleChange}
                hidePostalCode={true}
                {...createOptions("15px")}
              />
            )}
          </div>
          <div className="input-wrapper ta-left">
            <button
              disabled={!change.complete || saving}
              type="submit"
              className="button button_green button_225 button_icon"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 0C3.1339 0 0 3.1339 0 7C0 10.8661 3.1339 14 7 14C10.8661 14 14 10.8661 14 7C14 3.1339 10.8654 0 7 0ZM6.475 11.025L2.975 8.4L4.025 7L6.125 8.575L9.8 3.675L11.2 4.725L6.475 11.025Z"
                  fill="white"
                />
              </svg>
              {!saving ? <span>Pay</span> : <span>Purchasing...</span>}
            </button>
            <div className="text-green mt10">
              This will be a secure 128-bit SSL encrypted credit card payment
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions
  }
}

const mapDispatchToProps = {
  fetchUserRequest
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectStripe(ChangePlanPay))
