import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { NavLink, Router, Route, Switch, Redirect } from 'react-router-dom'
import TopPanel from '../Container/TopPanel/TopPanel'
import Aux from '../../hoc/Aux'
import General from './General'
// import Billing from "./Billing/Billing"
import Billing from './Billing/BillingInfo'
import UpdatePaymentMethod from './Billing/UpdatePaymentMethod'
import ChangePlan from './Billing/ChangePlan'
import ChangePlanPay from './Billing/ChangePlanPay'
import Success from '../../components/Profile/Billing/Success'
import Fail from '../../components/Profile/Billing/Fail'
import UpdateBillingInfo from './Billing/UpdateBillingInfo'

import history from '../../history'
import { StripeProvider, Elements } from 'react-stripe-elements'
import { ListIcon, ChequeIcon, ArrowLeft } from 'components/Icons'
import AppPanel from "../Container/TopPanel/AppPanel";

const pathsWithoutMenu = [
  '/address',
  '/update-payment-method',
  '/change-plan',
  '/fail',
  '/success',
]

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stripe: null
    }
  }
  componentDidMount() {
    document.title = 'Apphud | Profile';
    if (window.Stripe) {
      this.setState({stripe: window.Stripe(window.STRIPE_KEY)});
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({stripe: window.Stripe(window.STRIPE_KEY)});
      });
    }
  }

  goBack = (e) => {
    if (window.location.pathname.indexOf('update-payment-method') > -1) {
      e.preventDefault()
      history.push('/profile/billing')
    } else if (
      ['/profile/general', '/profile/billing'].indexOf(
        window.location.pathname
      ) > -1
    ) {
      const { apps } = this.props

      if (apps.length === 0) {
        history.push('/newapp')
      } else {
        const lastId = localStorage.getItem('lastApplicationId')
        let lastApp = apps[0]

        if (lastId) {
          const app = apps.find((app) => app.id === lastId)
          if (app) lastApp = app
        }

        history.push(`/apps/${lastApp.id}/dashboard`)
      }
    } else {
      e.preventDefault()
      history.goBack()
    }
  }

  showDefaultTitle = () => {
    let result = true
    for (const path of pathsWithoutMenu) {
      if (window.location.pathname.indexOf(path) > -1) result = false
    }
    return result
  }

  getTitle = (path) => {
    switch (path) {
      case '/profile/billing/change-plan':
        return 'Change Plan'
      case '/profile/billing/fail':
        return 'Payment error occured'
      case '/profile/billing/success':
        return 'Thank you for being a customer!'
      case '/profile/billing/update-payment-method':
        return 'Update payment method'
      case '/profile/billing/address':
        return 'Update billing info'

      default:
        return 'Profile Settings'
    }
  }

  render() {
    const { location } = this.props
    return (
      <Aux>
        {/* <div className="top-line__notify top-line__notify_orange">
          <span className="top-line__notify-text">Please confirm your email</span>
          <button className="button button_white fr">Resend email</button>
        </div>
        <div className="top-line__notify top-line__notify_red">
          <span className="top-line__notify-text">You reached your plan’s limit. Please upgrade your plan</span>
          <button className="button button_white fr">Upgrade plan</button>
        </div> */}
        <TopPanel disableMenu={true} />
        <div className="container-content container-content__blue container-content__blue_profile">
          <div className="container-content container-content__blue container-content__appsettings container-content__appsettings-profile">
            <div className="container-content__blue-header container-content__blue-header_menu">
              <div className="container-content__profile">
                <div className="container-title">
                  {[
                    '/profile/billing/fail',
                    '/profile/billing/success',
                  ].indexOf(location.pathname) === -1 && (
                      <NavLink
                        onClick={this.goBack}
                        to={`/apps/${this.props.lastapp && this.props.lastapp.id
                          }/dashboard`}
                        className="button button_blue newapp-container__button"
                      >
                        <ArrowLeft />
                      </NavLink>
                    )}
                  <span className="va-middle" id="current-tab">
                    {this.getTitle(location.pathname)}
                  </span>
                  <span className="va-middle" id="current-tab2" />
                </div>
                {this.showDefaultTitle() && (
                  <div className="container-header-menu">
                    <NavLink
                      to="/profile/general"
                      activeClassName="container-header-menu__item_active"
                      className="container-header-menu__item"
                    >
                      <ListIcon />
                      <span>General</span>
                    </NavLink>
                    <NavLink
                      to="/profile/billing"
                      activeClassName="container-header-menu__item_active"
                      className="container-header-menu__item"
                    >
                      <ChequeIcon />
                      <span>Plan and billing</span>
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="container-content__profile">
            <Route exact component={General} path="/profile/general" />
            <StripeProvider stripe={this.state.stripe}>
              <Elements
                fonts={[
                  {
                    cssSrc:
                      'https://fonts.googleapis.com/css?family=Ubuntu:100,200,300,400,500,600',
                  },
                ]}
              >
                <Aux>
                  <Route exact path="/profile/billing" >
                    <Billing></Billing>
                  </Route >
                  <Route
                    exact
                    component={UpdatePaymentMethod}
                    path="/profile/billing/update-payment-method"
                  />
                  <Route
                    exact
                    component={UpdateBillingInfo}
                    path="/profile/billing/address"
                  />
                  <Route
                    exact
                    component={ChangePlanPay}
                    path="/profile/billing/change-plan/:planId"
                  />
                </Aux>
              </Elements>
            </StripeProvider>
            <Route
              exact
              component={ChangePlan}
              path="/profile/billing/change-plan"
            />
            <Route exact component={Success} path="/profile/billing/success" />
            <Route exact component={Fail} path="/profile/billing/fail" />
          </div>
        </div>
      </Aux>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    lastapp: state.application,
    apps: state.applications,
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
