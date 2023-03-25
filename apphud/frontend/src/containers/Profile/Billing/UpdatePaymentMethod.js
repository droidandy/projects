import React, { Component } from 'react'
import { connect } from 'react-redux'
import history from '../../../history'
import SweetAlert from 'react-swal'
import { CardElement, injectStripe } from 'react-stripe-elements'
import { NotificationManager } from '../../../libs/Notifications'
import axios from 'axios'
import { fetchUserRequest } from '../../../actions/user'
import styles from './index.module.css'

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        lineHeight: 'normal',
        '-webkit-font-smoothing': 'antialiased',
        fontFamily: 'Ubuntu',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }
}

class UpdatePaymentMethod extends Component {
  state = {
    alertOpen: false,
    change: {
      complete: false,
    },
    removing: false,
    saving: false,
  }

  handleRemove = () => {
    this.setState({ alertOpen: true })
  }

  handleCallbackAlert = (ok) => {
    if (ok) this.removePaymentMethod()

    this.setState({ alertOpen: false })
  }

  removePaymentMethod = () => {
    this.setState({ removing: true })
    axios
      .delete(
        `/billing/payment_methods/${this.props.user.payment_method.identifier}`
      )
      .then(() => {
        NotificationManager.success(
          'Payment method successfully deleted.',
          'OK',
          5000
        )
        this.props.fetchUserRequest()
        this.setState({ removing: false })
      })
  }

  savePaymentMethod = (source) => {
    const { user } = this.props
    const action = user.customer_id ? 'put' : 'post'

    axios[action](`/billing/payment_methods?source=${source}`)
      .then(() => {
        this.setState({
          saving: false,
        })
        NotificationManager.success(
          'Payment method successfully updated.',
          'OK',
          5000
        )
        history.push('/profile/billing')
      })
      .catch(() => {
        history.push('/profile/billing/fail')
      })
  }

  onTokenReceived = ({ token }) => {
    this.savePaymentMethod(token.id)
  }

  handleSubmit = (ev) => {
    ev.preventDefault()
    const { stripe } = this.props

    if (stripe) {
      this.setState({ saving: true })
      stripe.createToken().then(this.onTokenReceived)
    } else {
      console.log("Stripe.js hasn't loaded yet.")
    }
  }

  handleChange = (change) => {
    this.setState({ change })
  }

  render() {
    const { change, saving, removing } = this.state
    const { payment_method } = this.props.user
    return (
      <div className={styles['wrapper']}>
        <div className="c-c__b-billing__update-payment-method">
          <SweetAlert
            isOpen={this.state.alertOpen}
            type="warning"
            title="Confirm removal"
            text="Do you really want to remove this payment method?"
            confirmButtonText="Remove"
            cancelButtonText="Cancel"
            callback={this.handleCallbackAlert}
          />
          <form onSubmit={this.handleSubmit}>
            <div className="input-wrapper input-wrapper_mt30 ta-left">
              <label className="l-p__label" htmlFor="name">
                Card
              </label>
              <CardElement
                onChange={this.handleChange}
                hidePostalCode={true}
                {...createOptions('15px')}
              />
            </div>
            <div className="input-wrapper ta-left">
              <button
                disabled={!change.complete || saving}
                type="submit"
                className="button button_green button_160 button_icon"
              >
                {saving ? <span>Saving..</span> : <span>Save</span>}
              </button>
              {payment_method && (
                <button
                  type="button"
                  disabled={removing}
                  onClick={this.handleRemove}
                  className="fr button button_red button_160"
                >
                  {removing ? 'Removing card..' : 'Remove saved card'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
  }
}

const mapDispatchToProps = {
  fetchUserRequest,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectStripe(UpdatePaymentMethod))
