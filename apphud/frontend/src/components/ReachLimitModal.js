import React from "react"
import Modal from "react-modal"
import superheroImage from "../assets/images/image-superhero.jpg"
import NumberFormat from "react-number-format"

const customStylesPopUp = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 8,
    width: 600,
    overlfow: "visible"
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

class ReachLimitModal extends React.Component {
  render() {
    const { user, close, userBillingUsage } = this.props

    return (
      <Modal
        isOpen={true}
        className="ReactModal__Content ReactModal__Content-visible"
        ariaHideApp={false}
        style={customStylesPopUp}
        contentLabel="Upgrade"
      >
        <div style={{ padding: "20px 30px" }} className="upgrade-plan__modal">
          <svg
            onClick={close}
            className="upgrade-plan__modal-close"
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
              fill="#97ADC6"
            />
          </svg>
          <div className="ta-center">
            <img src={superheroImage} width="350px" height="226px" />
          </div>
          <div className="upgrade-plan__modal-title ta-center">
            Plan limit has been reached
          </div>
          <div className="upgrade-plan__modal-description ta-center">
            You have reached MTR included to your current plan.
            <br />
            <b>
              Revenue tracked this month:&nbsp;
              <NumberFormat
                value={Math.round(userBillingUsage?.mtr_total)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
              &nbsp;of&nbsp;
              <NumberFormat
                value={Math.round(user.subscription.plan.mtr)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
            </b>
          </div>
          <div className="upgrade-plan__modal-description mt15 ta-center">
            You can continue using Apphud as usual. You will be billed for
            overaged MTR at the end of billing period. It will cost&nbsp;
            <NumberFormat
              value={user.subscription.plan.price_per_1k_mtr}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
            />
            &nbsp;per additional $1,000 MTR.
          </div>
          <div className="ta-center">
            <button
              onClick={close}
              className="button button_green button_160 button_inline-block mt30"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

export default ReachLimitModal
