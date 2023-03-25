import React from "react"
import { NavLink } from "react-router-dom"
import Tip from "containers/Common/Tip"
import NumberFormat from "react-number-format"
import { CurrentPlanIcon } from "components/Icons"
import PlanName from "./PlanName"
import styles from "./index.module.css"
import moment from "moment";

const BillingPlan = ({ plan, usage_stats, current_period_start, current_period_end }) => {
  const onIconError = (e) => {
    e.target.style.display = "none"
  }
  return (
    <div className="c-c__b-billing__current-plan">
      <div className="c-c__b-billing__title">
        <CurrentPlanIcon />
        <span className="c-c__b-billing__title-text">Current plan</span>
      </div>
      <PlanName plan={plan} />
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
              value={Math.round(usage_stats.mtr_total)}
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
                    Math.round(usage_stats.overage_since_free_plan)
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
                    Math.round(usage_stats.mtr_with_overage - plan.mtr)
                  )}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </b>
            </div>
          </div>
        )}
        { current_period_start
            && <div className="c-c__b-billing__current-plan__desc-row group">
                Currect billng month start:&nbsp;
                <b>
                    {moment(current_period_start).format("MMM DD, YYYY")}
                </b>
            </div>
        }
        { current_period_end
            && <div className="c-c__b-billing__current-plan__desc-row">
                Currect billng month end:&nbsp;
                <b>
                    {moment(current_period_end).format("MMM DD, YYYY")}
                </b>
            </div>
        }
      </div>
      <div className="c-c__b-billing__current-plan__apps">
        {usage_stats.apps.map((app, index) => (
          <div className="c-c__b-billing__current-plan__apps-item" key={index}>
            <div className="c-c__b-billing__current-plan__apps-item__icon">
              <img src={app.icon_url} onError={onIconError} />
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
  )
}

export default BillingPlan
