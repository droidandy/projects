import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import history from "../../../history"
import classNames from "classnames"
import axios from "axios"
import Modal from "react-modal"
import Moment from "react-moment"
import { fetchUserRequest } from "../../../actions/user"
import NumberFormat from "react-number-format"
import sortBy from "lodash/sortBy"

import imageFree from "../../../assets/images/image-free.png"
import imageLaunch from "../../../assets/images/image-launch.png"
import imageGrow from "../../../assets/images/image-grow.png"
import {track} from "../../../libs/helpers";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 8,
    width: 410
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

class ChangePlan extends Component {
  state = {
    plans: [{}, {}, {}],
    customPlans: [],
    loading: true,
    currentPlan: {},
    upgradePlanConfirm: false,
    downgradePlanConfirm: false,
    freePlanConfirm: false
  };

  componentDidMount() {
    this.getPlans()
    window.scrollTo(0, 0)
  }

  updatePlan = (planId) => {
    const plans = this.allPlans
    const plan = plans.find(({ id }) => planId === id)
    const { user, fetchUserRequest } = this.props
    const action =
      user.subscription.plan.free || user.subscription.cancel_at
        ? "post"
        : "put"
    track("profile_plan_changed", {
      old_plan: user.subscription.plan,
      new_plan: plan
    });
    if (user.payment_method || plan.free) {
      plan.saving = true
      plan.buttonText = this.buttonText
      this.setState({
        plans: sortBy(
          plans.filter((p) => p.public),
          "position"
        ),
        customPlans: sortBy(
          plans.filter((p) => !p.public),
          "position"
        )
      })
      this.handleCloseFreePlanConfirm()
      this.handleCloseDowngradePlanConfirm()
      this.handleCloseUpgradePlanConfirm()

      axios[action](`/billing/subscriptions?plan=${planId}`)
        .then(() => {
          plan.saving = false
          this.setState({
            plans: sortBy(
              this.allPlans.filter((p) => p.public),
              "position"
            ),
            customPlans: sortBy(
              this.allPlans.filter((p) => !p.public),
              "position"
            )
          })

          if (plan.free) history.push("/profile/billing")
          else history.push("/profile/billing/success")

          fetchUserRequest()
        })
        .catch(() => {
          history.push("/profile/billing/fail")
        })
    } else history.push(`/profile/billing/change-plan/${planId}`)
  };

  allPlans = [];

  getPlans = () => {
    axios.get("/billing/plans").then((response) => {
      const { results } = response.data.data
      this.allPlans = results
      this.setState({
        plans: sortBy(
          results.filter((p) => p.public),
          "position"
        ),
        customPlans: sortBy(
          results.filter((p) => !p.public),
          "position"
        ),
        loading: false
      })
    })
  };

  getCover = (index) => {
    if (index === 0) return imageFree
    if (index === 1) return imageLaunch
    if (index === 2) return imageGrow
  };

  handleChoosePlan = (plan) => {
    const { user } = this.props

    if (plan.free) {
      this.setState({
        freePlanConfirm: true,
        currentPlan: plan
      })
      this.buttonText = "Downgrading plan..."
    } else if (!user.payment_method) {
      history.push(`/profile/billing/change-plan/${plan.id}`)
    } else if (plan.price > user.subscription.plan.price) {
      this.setState({
        upgradePlanConfirm: true,
        currentPlan: plan
      })
      this.buttonText = "Upgrading plan..."
    } else if (plan.price < user.subscription.plan.price) {
      this.setState({
        downgradePlanConfirm: true,
        currentPlan: plan
      })
      this.buttonText = "Downgrading plan..."
    }
  };

  handleCloseFreePlanConfirm = () => {
    this.setState({ freePlanConfirm: false })
  };

  handleCloseDowngradePlanConfirm = () => {
    this.setState({ downgradePlanConfirm: false })
  };

  handleCloseUpgradePlanConfirm = () => {
    this.setState({ upgradePlanConfirm: false })
  };

  render() {
    const { plans, loading, currentPlan, customPlans } = this.state
    const { user } = this.props
    return (
      <div className="c-c__b-billing__change-plan">
        <div className="c-c__b-billing__change-plan__items">
          {plans.map((plan, index) => (
            <div
              className="c-c__b-billing__change-plan__items-item"
              key={index}
              style={loading ? { height: 392 } : {}}
            >
              <img
                className="c-c__b-billing__change-plan__items-item__image"
                src={this.getCover(index)}
              />
              <div className="c-c__b-billing__change-plan__items-item__title">
                {plan.name}
              </div>
              <div className="c-c__b-billing__change-plan__items-item__description">
                <NumberFormat
                  value={plan.mtr}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                &nbsp;monthly tracked revenue included
              </div>
              <div className="c-c__b-billing__change-plan__items-item__price">
                {!plan.free ? <span>from&nbsp;</span> : ""}$
                {parseFloat(plan.price).toFixed(2)}
                <span>&nbsp;per month</span>
              </div>
              {user.subscription.plan.id === plan.id ? (
                <button
                  disabled={true}
                  className="button button_green button_full button_icon c-c__b-billing__change-plan__items-item__button"
                  to="/"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 1C4.1339 1 1 4.1339 1 8C1 11.8661 4.1339 15 8 15C11.8661 15 15 11.8661 15 8C15 4.1339 11.8654 1 8 1ZM7.475 12.025L3.975 9.4L5.025 8L7.125 9.575L10.8 4.675L12.2 5.725L7.475 12.025Z"
                      fill="white"
                    />
                  </svg>
                  <span>Current plan</span>
                </button>
              ) : (
                <button
                  disabled={
                    plan.saving || (plan.free && user.subscription.cancel_at)
                  }
                  onClick={this.handleChoosePlan.bind(null, plan)}
                  className="button button_green button_full c-c__b-billing__change-plan__items-item__button"
                >
                  {plan.free && user.subscription.cancel_at
                    ? "Upcoming plan"
                    : plan.saving
                      ? plan.buttonText
                      : "Choose this plan"}
                </button>
              )}
              {loading && (
                <div
                  className="animated-background timeline-item"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%"
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="ta-center c-c__b-billing__change-plan__info">
          Earning more than $100,000 per month?{" "}
          <a
            className="link link_normal"
            href="https://apphud.com/contact"
            target="_blank"
          >
            Contact us
          </a>{" "}
          to join Enterprise plan
          <br />
          View detailed plans comparison{" "}
          <a
            className="link link_normal"
            href="https://apphud.com/pricing"
            target="_blank"
          >
            here
          </a>
        </div>
        {customPlans.length > 0 && (
          <div>
            <div className="container-content__integrations-settings__content-title">
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
                  d="M2 2C1.44772 2 1 2.44772 1 3V5.5C1 5.77614 1.22733 5.99359 1.49494 6.06171C2.36012 6.28197 3 7.06626 3 8C3 8.93374 2.36012 9.71803 1.49494 9.93829C1.22733 10.0064 1 10.2239 1 10.5V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V10.5C15 10.2239 14.7727 10.0064 14.5051 9.93829C13.6399 9.71803 13 8.93374 13 8C13 7.06626 13.6399 6.28197 14.5051 6.06171C14.7727 5.99359 15 5.77614 15 5.5V3C15 2.44772 14.5523 2 14 2H2ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                  fill="#97ADC6"
                />
              </svg>
              <span>Custom plans</span>
            </div>
            <div>
              <table className="table table-billing__custom-plans">
                <thead>
                  <tr className="table100-head">
                    <th>
                      <span className="uppercase">NAME</span>
                    </th>
                    <th>
                      <span className="uppercase">MTR INCLUDED</span>
                    </th>
                    <th>
                      <span className="uppercase">PRICE PER MONTH</span>
                    </th>
                    <th>
                      <span className="uppercase">
                        PRICE PER ADDITIONAL $1,000 MTR
                      </span>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {customPlans.map((plan, index) => (
                    <tr key={index}>
                      <td>{plan.name}</td>
                      <td>
                        <NumberFormat
                          value={plan.mtr}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </td>
                      <td>
                        <NumberFormat
                          value={parseFloat(plan.price).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </td>
                      <td>
                        <NumberFormat
                          value={parseFloat(plan.price_per_1k_mtr).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </td>
                      <td>
                        {user.subscription.plan.id === plan.id ? (
                          <button
                            disabled={true}
                            className="button button_green button_full button_icon c-c__b-billing__change-plan__items-item__button table-billing__custom-plans__button"
                            to="/"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 1C4.1339 1 1 4.1339 1 8C1 11.8661 4.1339 15 8 15C11.8661 15 15 11.8661 15 8C15 4.1339 11.8654 1 8 1ZM7.475 12.025L3.975 9.4L5.025 8L7.125 9.575L10.8 4.675L12.2 5.725L7.475 12.025Z"
                                fill="white"
                              />
                            </svg>
                            <span>Current plan</span>
                          </button>
                        ) : (
                          <button
                            disabled={
                              plan.saving ||
                              (plan.free && user.subscription.cancel_at)
                            }
                            onClick={this.handleChoosePlan.bind(null, plan)}
                            className="button button_green button_full c-c__b-billing__change-plan__items-item__button table-billing__custom-plans__button"
                          >
                            {plan.free && user.subscription.cancel_at
                              ? "Upcoming plan"
                              : plan.saving
                                ? plan.buttonText
                                : "Choose plan"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Modal
          isOpen={this.state.freePlanConfirm}
          onRequestClose={this.handleCloseFreePlanConfirm}
          ariaHideApp={false}
          style={customStyles}
          contentLabel="Confirm downgrade"
        >
          <div style={{ padding: "20px 30px" }}>
            <div className="newapp-header__title">Confirm downgrade</div>
            <div className="input-wrapper">
              Do you really want to downgrade to Free plan? You will continue
              using your current plan till&nbsp;
              <Moment
                className="uppercase"
                format="MMM DD, Y"
                date={user.subscription.current_period_end}
              />
              .
            </div>
            <div className="input-wrapper">
              <button
                className="button button_blue popup-button fl"
                onClick={this.handleCloseFreePlanConfirm}
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={this.updatePlan.bind(null, currentPlan.id)}
                className="button button_green popup-button fr"
              >
                <span>Downgrade</span>
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.downgradePlanConfirm}
          onRequestClose={this.handleCloseDowngradePlanConfirm}
          ariaHideApp={false}
          style={customStyles}
          contentLabel="Confirm downgrade"
        >
          <div style={{ padding: "20px 30px" }}>
            <div className="newapp-header__title">Confirm downgrade</div>
            <div className="input-wrapper">
              Do you really want to downgrade to {currentPlan.name}? This change
              will take effect immediately.
            </div>
            <div className="input-wrapper">
              <button
                className="button button_blue popup-button fl"
                onClick={this.handleCloseDowngradePlanConfirm}
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={this.updatePlan.bind(null, currentPlan.id)}
                className="button button_green popup-button fr"
              >
                <span>Downgrade</span>
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.upgradePlanConfirm}
          onRequestClose={this.handleCloseUpgradePlanConfirm}
          ariaHideApp={false}
          style={customStyles}
          contentLabel="Confirm upgrade"
        >
          <div style={{ padding: "20px 30px" }}>
            <div className="newapp-header__title">Confirm upgrade</div>
            <div className="input-wrapper">
              Please, confirm plan upgrade. You will be charged prorated amount
              immediately.
            </div>
            <div className="input-wrapper">
              <button
                className="button button_blue popup-button fl"
                onClick={this.handleCloseUpgradePlanConfirm}
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={this.updatePlan.bind(null, currentPlan.id)}
                className="button button_green popup-button fr"
              >
                <span>Upgrade</span>
              </button>
            </div>
          </div>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePlan)
