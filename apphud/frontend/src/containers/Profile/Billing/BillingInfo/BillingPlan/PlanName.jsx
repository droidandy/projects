import React from "react"
import Tip from "containers/Common/Tip"

const PlanName = ({ plan }) => {
  const planTipDescription = ({ mtr, price, price_per_1k_mtr, free }) => {
    let result = `<b>$${mtr.toLocaleString("en", {
      minimumFractionDigits: 0,
    })} MTR included</b> <br />$${parseFloat(price).toFixed(
      2
    )} per month <br />`

    if (!free) {
      result += `$${parseFloat(price_per_1k_mtr).toFixed(
        2
      )} per additional $1,000 MTR`
    }

    return result
  }

  return (
    <div className="c-c__b-billing__current-plan__title">
      <span className="c-c__b-billing__current-plan__title-span">
        {plan.name}
      </span>
      <Tip
        title={plan.name}
        description={planTipDescription(plan)}
        buttonUrl="https://apphud.com/pricing"
      />
    </div>
  )
}

export default PlanName
