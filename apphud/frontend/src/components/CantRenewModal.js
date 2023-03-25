import React from "react"
import { NavLink } from "react-router-dom"
import history from "../history"
import Modal from "react-modal"
import classNames from "classnames"
import Moment from "moment"
import errorImage from "../assets/images/image-credit_card_issue-350.jpg"

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

class UpgradeModal extends React.Component {
  render() {
    const { close, application } = this.props
    const { user_collaboration, user } = application

    return (
      <Modal
        isOpen={true}
        className="ReactModal__Content ReactModal__Content-visible"
        ariaHideApp={false}
        style={customStylesPopUp}
        contentLabel="Upgrade"
      >
        {user_collaboration && (
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
              <img src={errorImage} width="350px" height="226px" />
              <div className="upgrade-plan__modal-title">
                We can’t renew your plan
              </div>
              {user_collaboration.role === "owner" ? (
                <div className="upgrade-plan__modal-description">
                  There was a billing issue while renewing your plan. Please,
                  update your payment method.
                </div>
              ) : (
                <div className="upgrade-plan__modal-description">
                  There was a billing issue while renewing your plan. Please,
                  ask app owner{" "}
                  <b>
                    (
                    <a className="nolink-inline" href={`mailto:${user.email}`}>
                      {user.email}
                    </a>
                    )
                  </b>{" "}
                  to upgrade payment method.
                </div>
              )}
              <ul className="upgrade-plan__modal-list ta-left">
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
                        d="M2.10056 13.4143C1.31951 12.6332 1.31951 11.3669 2.10056 10.5858L10.5858 2.10056C11.3669 1.31951 12.6332 1.31951 13.4143 2.10056L21.8995 10.5858C22.6806 11.3669 22.6806 12.6332 21.8995 13.4143L13.4143 21.8995C12.6332 22.6806 11.3669 22.6806 10.5858 21.8995L2.10056 13.4143ZM11.0001 7.00005H13.0001V13.0001H11.0001V7.00005ZM12.0001 17C12.8285 17 13.5001 16.3284 13.5001 15.5C13.5001 14.6716 12.8285 14 12.0001 14C11.1716 14 10.5001 14.6716 10.5001 15.5C10.5001 16.3284 11.1716 17 12.0001 17Z"
                        fill="#FF0C46"
                    />
                  </svg>
                  <span className="va-middle">
                    We <mark className="text-red">will stop updating</mark> user subscription state in&nbsp;
                      {user.subscription.cancel_at && (
                          <Moment
                              className="uppercase"
                              format="MMM DD, Y"
                              date={user.subscription.cancel_at}
                          />
                      )}
                      .
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
                      d="M2.10056 13.4143C1.31951 12.6332 1.31951 11.3669 2.10056 10.5858L10.5858 2.10056C11.3669 1.31951 12.6332 1.31951 13.4143 2.10056L21.8995 10.5858C22.6806 11.3669 22.6806 12.6332 21.8995 13.4143L13.4143 21.8995C12.6332 22.6806 11.3669 22.6806 10.5858 21.8995L2.10056 13.4143ZM11.0001 7.00005H13.0001V13.0001H11.0001V7.00005ZM12.0001 17C12.8285 17 13.5001 16.3284 13.5001 15.5C13.5001 14.6716 12.8285 14 12.0001 14C11.1716 14 10.5001 14.6716 10.5001 15.5C10.5001 16.3284 11.1716 17 12.0001 17Z"
                      fill="#FF0C46"
                    />
                  </svg>
                  <span className="va-middle">
                    Integrations and webhooks&nbsp;
                    <mark className="text-red">will be disabled</mark> in&nbsp;
                    {user.subscription.cancel_at && (
                      <Moment
                        className="uppercase"
                        format="MMM DD, Y"
                        date={user.subscription.cancel_at}
                      />
                    )}
                    .
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
                      d="M2.10056 13.4143C1.31951 12.6332 1.31951 11.3669 2.10056 10.5858L10.5858 2.10056C11.3669 1.31951 12.6332 1.31951 13.4143 2.10056L21.8995 10.5858C22.6806 11.3669 22.6806 12.6332 21.8995 13.4143L13.4143 21.8995C12.6332 22.6806 11.3669 22.6806 10.5858 21.8995L2.10056 13.4143ZM11.0001 7.00005H13.0001V13.0001H11.0001V7.00005ZM12.0001 17C12.8285 17 13.5001 16.3284 13.5001 15.5C13.5001 14.6716 12.8285 14 12.0001 14C11.1716 14 10.5001 14.6716 10.5001 15.5C10.5001 16.3284 11.1716 17 12.0001 17Z"
                      fill="#FF0C46"
                    />
                  </svg>
                  <span className="va-middle">
                    Rules <mark className="text-red">will be disabled</mark>{" "}
                    in&nbsp;
                    {user.subscription.cancel_at && (
                      <Moment
                        className="uppercase"
                        format="MMM DD, Y"
                        date={user.subscription.cancel_at}
                      />
                    )}
                    .
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
                      d="M2.10056 13.4143C1.31951 12.6332 1.31951 11.3669 2.10056 10.5858L10.5858 2.10056C11.3669 1.31951 12.6332 1.31951 13.4143 2.10056L21.8995 10.5858C22.6806 11.3669 22.6806 12.6332 21.8995 13.4143L13.4143 21.8995C12.6332 22.6806 11.3669 22.6806 10.5858 21.8995L2.10056 13.4143ZM11.0001 7.00005H13.0001V13.0001H11.0001V7.00005ZM12.0001 17C12.8285 17 13.5001 16.3284 13.5001 15.5C13.5001 14.6716 12.8285 14 12.0001 14C11.1716 14 10.5001 14.6716 10.5001 15.5C10.5001 16.3284 11.1716 17 12.0001 17Z"
                      fill="#FF0C46"
                    />
                  </svg>
                  <span className="va-middle">
                    Customers API{" "}
                    <mark className="text-red">will be disabled</mark> in&nbsp;
                    {user.subscription.cancel_at && (
                      <Moment
                        className="uppercase"
                        format="MMM DD, Y"
                        date={user.subscription.cancel_at}
                      />
                    )}
                    .
                  </span>
                </li>
              </ul>
              {user_collaboration.role === "owner" && (
                <div className="mt30">
                  <NavLink
                    className="button button_green button_225 va-middle button_inline-block"
                    to="/profile/billing/update-payment-method"
                  >
                    Update payment method
                  </NavLink>
                </div>
              )}
              <div
                className={
                  user_collaboration.role === "owner" ? "mt10" : "mt30"
                }
              >
                <a
                  href="https://apphud.com/contact"
                  target="_blank"
                  className="link link_normal"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>
    )
  }
}

export default UpgradeModal
