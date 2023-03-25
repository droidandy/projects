import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import Tip from "../../Common/Tip"
import Moment from "react-moment"
import axios from "axios"
import NumberFormat from "react-number-format"
import { fetchUserRequest } from "../../../actions/user"
import Aux from "../../../hoc/Aux"
import { fetchBillingUsageStats } from "actions/billing"

class Billing extends Component {
  state = {
    upgradePlanModal: false,
    invoices: []
  };

  planTipDescription = ({ mtr, price, price_per_1k_mtr, free }) => {
    let result = `<b>$${mtr.toLocaleString("en", {
      minimumFractionDigits: 0
    })} MTR included</b> <br />$${parseFloat(price).toFixed(
      2
    )} per month <br />`

    if (!free) {
      result += `$${parseFloat(price_per_1k_mtr).toFixed(
        2
      )} per additional $1,000 MTR`
    }

    return result
  };

  onIconError = (e) => {
    e.target.style.display = "none"
  };

  componentDidMount() {
    this.getInvoices()
    this.props.fetchUserRequest()
    this.props.fetchBillingUsageStats()
  }

  getInvoices = () => {
    this.setState({ loading: true })
    axios.get("/billing/charges").then((response) => {
      const { results } = response.data.data
      this.setState({
        invoices: results.slice(0, 36),
        hello: "remove me",
        loading: false
      })
    })
  };

  render() {
    const { invoices } = this.state
    const {
      subscription,
      payment_method,
      customer_id
    } = this.props.user
    const { plan, apps } = subscription
    return (
      <div className="container-content__profile-billing">
        <div className="c-c__b-billing__current-plan">
          <div className="c-c__b-billing__title">
            <svg
              className="c-c__b-billing__title-icon"
              width="14"
              height="12"
              viewBox="0 0 14 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 0C0.447715 0 0 0.447715 0 1V3.5C0 3.77614 0.227334 3.99359 0.494941 4.06171C1.36012 4.28197 2 5.06626 2 6C2 6.93374 1.36012 7.71803 0.49494 7.93829C0.227334 8.00641 0 8.22386 0 8.5V11C0 11.5523 0.447716 12 1 12H13C13.5523 12 14 11.5523 14 11V8.5C14 8.22386 13.7727 8.00641 13.5051 7.93829C12.6399 7.71803 12 6.93374 12 6C12 5.06626 12.6399 4.28197 13.5051 4.06171C13.7727 3.99359 14 3.77614 14 3.5V1C14 0.447715 13.5523 0 13 0H1ZM7 8C8.10457 8 9 7.10457 9 6C9 4.89543 8.10457 4 7 4C5.89543 4 5 4.89543 5 6C5 7.10457 5.89543 8 7 8Z"
                fill="#97ADC6"
              />
            </svg>
            <span className="c-c__b-billing__title-text">Current plan</span>
          </div>
          <div className="c-c__b-billing__current-plan__title">
            <span className="c-c__b-billing__current-plan__title-span">
              {plan.name}
            </span>
            <Tip
              title={plan.name}
              description={this.planTipDescription(plan)}
              buttonUrl="https://apphud.com/pricing"
            />
          </div>
          <div className="c-c__b-billing__current-plan__desc">
            <div className="c-c__b-billing__current-plan__desc-row">
              MTR included in plan:&nbsp;
              <b>
                <NumberFormat
                  value={plan.mtr}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </b>
            </div>
            <div className="c-c__b-billing__current-plan__desc-row">
              Revenue tracked this billing month:&nbsp;
              <b>
                <NumberFormat
                  value={Math.round(userBillingUsage.mtr_total)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </b>
            </div>
            {!plan.free && (
              <div>
                <div className="c-c__b-billing__current-plan__desc-row">
                  Overaged MTR since Free plan:&nbsp;
                  <b>
                    <NumberFormat
                      value={Math.max(
                        0,
                        Math.round(userBillingUsage.overage_since_free_plan)
                      )}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </b>
                </div>
                <div className="c-c__b-billing__current-plan__desc-row">
                  Overaged MTR this billing month:&nbsp;
                  <b>
                    <NumberFormat
                      value={Math.max(
                        0,
                        Math.round(userBillingUsage.mtr_with_overage - plan.mtr)
                      )}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </b>
                </div>
              </div>
            )}
          </div>
          <div className="c-c__b-billing__current-plan__apps">
            {userBillingUsage.apps.map((app, index) => (
              <div
                className="c-c__b-billing__current-plan__apps-item"
                key={index}
              >
                <div className="c-c__b-billing__current-plan__apps-item__icon">
                  <img src={app.icon_url} onError={this.onIconError} />
                </div>
                <span className="c-c__b-billing__current-plan__apps-item__name">
                  {app.name}:&nbsp;
                  <NumberFormat
                    value={Math.round(app.mtr)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                </span>
              </div>
            ))}
          </div>
          <NavLink
            to="/profile/billing/change-plan"
            className="button button_green button_160 button_inline-block c-c__b-billing__current-plan__button"
          >
            Change plan
          </NavLink>
        </div>
        {customer_id && (
          <div className="c-c__b-billing__pm">
            <div className="c-c__b-billing__title">
              <svg
                className="c-c__b-billing__title-icon"
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1 0C0.447715 0 0 0.447715 0 1V2H14V1C14 0.447715 13.5523 0 13 0H1ZM14 3H0V9C0 9.55228 0.447716 10 1 10H13C13.5523 10 14 9.55229 14 9V3Z"
                  fill="#97ADC6"
                />
              </svg>
              <span className="c-c__b-billing__title-text">Payment method</span>
            </div>
            {payment_method ? (
              <div className="c-c__b-billing__pm-number c-c__b-billing__pm-number_card">
                {payment_method.payment_method}
              </div>
            ) : (
              <div className="c-c__b-billing__pm-number">
                No credit card saved
              </div>
            )}
            <NavLink
              to="/profile/billing/update-payment-method"
              className="link link_normal c-c__b-billing__pm-link"
            >
              Update payment method
            </NavLink>
          </div>
        )}
        {customer_id && (
          <div>
            {!plan.free && (
              <div className="c-c__b-billing__invoice c-c__b-billing__current-plan">
                <div className="c-c__b-billing__title">
                  <svg
                    className="c-c__b-billing__title-icon va-middle"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.5 2L3 1V15L5.5 14L8 15L10.5 14L13 15V1L10.5 2L8 1L5.5 2ZM9.5 5.5H8.5V5H7.5V5.5C7.10218 5.5 6.72064 5.65804 6.43934 5.93934C6.15804 6.22064 6 6.60218 6 7C6 7.39782 6.15804 7.77936 6.43934 8.06066C6.72064 8.34196 7.10218 8.5 7.5 8.5H8.5C8.77614 8.5 9 8.72386 9 9C9 9.27614 8.77614 9.5 8.5 9.5H7.5H6.5V10.5H7.5V11H8.5V10.5C8.89782 10.5 9.27936 10.342 9.56066 10.0607C9.84196 9.77936 10 9.39783 10 9C10 8.60218 9.84196 8.22064 9.56066 7.93934C9.27936 7.65804 8.89782 7.5 8.5 7.5H7.5C7.22386 7.5 7 7.27614 7 7C7 6.72386 7.22386 6.5 7.5 6.5H8.5H9.5V5.5Z"
                      fill="#97ADC6"
                    />
                  </svg>
                  <span className="c-c__b-billing__title-text va-middle">
                    Next invoice estimation
                  </span>
                </div>
                <div className="c-c__b-billing__current-plan__desc-row mt15">
                  Fixed fee:&nbsp;
                  <b>
                    <NumberFormat
                      value={
                        subscription.cancel_at
                          ? 0.0
                          : parseFloat(plan.price).toFixed(2)
                      }
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </b>
                </div>
                <div className="c-c__b-billing__current-plan__desc-row">
                  Overaged MTR fee:{" "}
                  <b>
                    (
                    <NumberFormat
                      value={Math.max(
                        0,
                        Math.round(userBillingUsage.overage_since_free_plan)
                      )}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                    &nbsp;+&nbsp;
                    <NumberFormat
                      value={Math.max(
                        0,
                        Math.round(userBillingUsage.mtr_with_overage - plan.mtr)
                      )}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                    ) ÷ $1,000 ×&nbsp;
                    <NumberFormat
                      value={plan.price_per_1k_mtr}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                    &nbsp;=&nbsp;
                    <NumberFormat
                      value={(
                        ((Math.max(
                          0,
                          Math.round(userBillingUsage.mtr_with_overage - plan.mtr)
                        ) +
                          Math.round(userBillingUsage.overage_since_free_plan)) /
                          1000) *
                        plan.price_per_1k_mtr
                      ).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </b>
                </div>
                <div className="c-c__b-billing__invoice-price">
                  Estimation: $
                  {subscription.cancel_at
                    ? (
                      ((Math.max(
                        0,
                        Math.round(userBillingUsage.mtr_with_overage - plan.mtr)
                      ) +
                          Math.round(userBillingUsage.overage_since_free_plan)) /
                          1000) *
                        plan.price_per_1k_mtr
                    ).toFixed(2)
                    : (
                      parseFloat(plan.price) +
                        ((Math.max(
                          0,
                          Math.round(userBillingUsage.mtr_with_overage - plan.mtr)
                        ) +
                          Math.round(userBillingUsage.overage_since_free_plan)) /
                          1000) *
                          plan.price_per_1k_mtr
                    ).toFixed(2)}
                </div>
                <div className="c-c__b-billing__invoice-description">
                  You will be charged on&nbsp;
                  <Moment
                    className="uppercase"
                    format="MMM DD, Y"
                    date={subscription.current_period_end}
                  />
                </div>
              </div>
            )}
            {!plan.free && subscription.cancel_at && (
              <div className="c-c__b-billing__pm">
                <div className="c-c__b-billing__title">
                  <svg
                    className="c-c__b-billing__title-icon va-middle"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.5858 9.46446L8.05025 13L6.63604 11.5858L9.22183 9L2 9L2 7L9.12132 7L6.63604 4.51471L8.05025 3.1005L11.5858 6.63604L13 8.05025L11.5858 9.46446Z"
                      fill="#97ADC6"
                    />
                  </svg>
                  <span className="c-c__b-billing__title-text va-middle">
                    Upcoming changes
                  </span>
                </div>
                <div className="c-c__b-billing__invoice-description mt15">
                  You will be downgraded to Free plan at&nbsp;
                  <Moment
                    className="uppercase"
                    format="MMM DD, Y"
                    date={subscription.cancel_at}
                  />
                  .
                </div>
              </div>
            )}
            <div className="container-content__integrations-settings__content-title">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="8" y="5.5" width="2" height="1" fill="#97ADC6" />
                <rect x="8" y="5" width="1" height="1.5" fill="#97ADC6" />
                <rect x="8" y="9.5" width="1" height="1.5" fill="#97ADC6" />
                <rect x="7" y="9.5" width="2" height="1" fill="#97ADC6" />
                <rect x="8" y="7.5" width="1" height="1" fill="#97ADC6" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.93934 8.06066C7.22064 8.34196 7.60218 8.5 8 8.5L8 7.5C7.72386 7.5 7.5 7.27614 7.5 7C7.5 6.72386 7.72386 6.5 8 6.5V5.5C7.60218 5.5 7.22064 5.65804 6.93934 5.93934C6.65804 6.22064 6.5 6.60218 6.5 7C6.5 7.39782 6.65804 7.77936 6.93934 8.06066Z"
                  fill="#97ADC6"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.0607 7.93934C9.77936 7.65804 9.39782 7.5 9 7.5L9 8.5C9.27614 8.5 9.5 8.72386 9.5 9C9.5 9.27614 9.27614 9.5 9 9.5V10.5C9.39782 10.5 9.77936 10.342 10.0607 10.0607C10.342 9.77936 10.5 9.39782 10.5 9C10.5 8.60218 10.342 8.22064 10.0607 7.93934Z"
                  fill="#97ADC6"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.86563 1.13451C8.50777 0.86441 7.1003 1.00303 5.82122 1.53285C4.54213 2.06266 3.44888 2.95987 2.67971 4.11101C1.91054 5.26215 1.5 6.61553 1.5 8L0.25 8L2.25 10.5L4.25 8L3 8C3 6.9122 3.32257 5.84884 3.92692 4.94437C4.53127 4.0399 5.39025 3.33495 6.39524 2.91867C7.40024 2.50238 8.5061 2.39347 9.573 2.60568C10.6399 2.8179 11.6199 3.34173 12.3891 4.11092C13.1583 4.88011 13.6821 5.86011 13.8943 6.92701C14.1065 7.9939 13.9976 9.09977 13.5813 10.1048C13.1651 11.1098 12.4601 11.9687 11.5556 12.5731C10.6512 13.1774 9.5878 13.5 8.5 13.5V15C9.88447 15 11.2378 14.5895 12.389 13.8203C13.5401 13.0511 14.4373 11.9579 14.9672 10.6788C15.497 9.3997 15.6356 7.99224 15.3655 6.63437C15.0954 5.2765 14.4287 4.02922 13.4497 3.05026C12.4708 2.07129 11.2235 1.4046 9.86563 1.13451Z"
                  fill="#97ADC6"
                />
              </svg>
              <span>Invoices</span>
            </div>
            <div>
              <table className="table">
                <thead>
                  <tr className="table100-head">
                    <th className="column1_integrations">
                      <span className="uppercase">ID</span>
                    </th>
                    <th className="column2">
                      <span className="uppercase">DATE</span>
                    </th>
                    <th className="column3">
                      <span className="uppercase">PAYMENT METHOD</span>
                    </th>
                    <th className="column4">
                      <span className="uppercase">AMOUNT</span>
                    </th>
                    <th className="column5">
                      <span className="uppercase">STATUS</span>
                    </th>
                    <th className="column5">
                      <span className="uppercase">RECEIPT</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <tr key={index}>
                      <td className="column1_integrations">
                        <span className="column-value">
                          {invoice.invoice_number}
                        </span>
                      </td>
                      <td className="column2 column-long">
                        <Moment
                          format="MMM DD, Y"
                          date={invoice.purchased_at}
                        />
                      </td>
                      <td className="column3">{invoice.payment_method}</td>
                      <td className="column4">
                        <NumberFormat
                          value={Math.round(invoice.amount)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </td>
                      <td className="column5 ta-center">
                        {invoice.status === "pending" && (
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
                              d="M19.0711 19.0711C22.9764 15.1658 22.9764 8.83417 19.0711 4.92893C15.1659 1.02369 8.83422 1.02369 4.92898 4.92893C1.02373 8.83418 1.02373 15.1658 4.92898 19.0711C8.83422 22.9763 15.1659 22.9763 19.0711 19.0711ZM9.00005 10L9.00005 7L15 7V10L14.995 10L15 10.005L13 12L15 14L14.995 14.005H15L15 17L9.00005 17L9.00005 14.005L9.00505 14.005L9.00005 14L11 12L9.00005 10.005L9.00505 10L9.00005 10Z"
                              fill="#F6921D"
                            />
                          </svg>
                        )}
                        {invoice.status === "failed" && (
                          <svg
                            style={{ marginTop: -2 }}
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
                        )}
                        {invoice.status === "succeeded" && (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10C20 4.477 15.522 0 10 0ZM9.25 15.75L4.25 12L5.75 10L8.75 12.25L14 5.25L16 6.75L9.25 15.75Z"
                              fill="#20BF55"
                            />
                          </svg>
                        )}
                      </td>
                      <td className="column4">
                        <a
                          className="link link_normal"
                          href={invoice.receipt_url}
                          target="_blank"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    userBillingUsage: state.user.usage_stats,
  }
}

const mapDispatchToProps = {
  fetchUserRequest,
  fetchBillingUsageStats
}

export default connect(mapStateToProps, mapDispatchToProps)(Billing)
