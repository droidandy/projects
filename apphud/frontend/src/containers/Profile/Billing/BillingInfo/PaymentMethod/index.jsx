import React from 'react'
import { CreditCardIcon } from 'components/Icons'
import { NavLink } from 'react-router-dom'
import styles from './index.module.css'
import classnames from 'classnames'

const PaymentMethod = ({ payment_method }) => {
  return (
    <div className="c-c__b-billing__pm">
      <div className="c-c__b-billing__title">
        <CreditCardIcon />
        <span className="c-c__b-billing__title-text">Payment method</span>
      </div>
      {payment_method ? (
        <div className="c-c__b-billing__pm-number c-c__b-billing__pm-number_card">
          {payment_method.payment_method}
        </div>
      ) : (
        <div className="c-c__b-billing__pm-number">No credit card saved</div>
      )}
      <div className={styles['links-wrapper']}>
        <NavLink
          to="/profile/billing/update-payment-method"
          className={classnames(
            'link',
            'link_normal',
            'c-c__b-billing__pm-link',
            styles['link-item']
          )}
        >
          Update payment method
        </NavLink>
        <NavLink
          to="/profile/billing/address"
          className={classnames(
            'link',
            'link_normal',
            'c-c__b-billing__pm-link',
            styles['link-item']
          )}
        >
          Update billing info
        </NavLink>
      </div>
    </div>
  )
}

export default PaymentMethod
