import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'
import Moment from 'react-moment'
import axios from 'axios'
import AceEditor from 'react-ace'
import 'brace/theme/github'
import 'brace/mode/json'
import SweetAlert from 'react-swal'
import { NotificationManager } from '../../../../libs/Notifications'
import history from '../../../../history'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { fetchCustomerRequest } from '../../../../actions/customer'

import Aux from '../../../../hoc/Aux'
import UserFeed from './UserFeed'
import CustomSelect from '../../../Common/CustomSelect'
import {Promotionals} from './Promotionals'

class UsersShow extends Component {
  state = {
    currentSubscription: {},
    loading: true,
    loading2: true,
    subscriptions: [],
    receipt: '',
    showAppsFlyer: false,
    showBranch: false,
    showTenjin: false,
    showAdjust: false,
    showSearchAds: false,
    alertOpen: false,
    sandbox: 0,
    nonRenewableSubscriptionsIds: [],
  }

  groupSubscriptions = (subscriptions) => {
    const renewable = []
    const nonrenewable = []
    const nonRenewableSubscriptionsIds = []

    for (const subscription of subscriptions) {
      if (subscription.kind === 'nonrenewable') {
        nonRenewableSubscriptionsIds.push(subscription.id)

        if (nonrenewable.length === 0) {
          subscription.product_group_name = 'Non renewing purchases'
          nonrenewable.push(subscription)
        }
      } else renewable.push(subscription)
    }

    return {
      subscriptions: nonrenewable.concat(renewable),
      nonRenewableSubscriptionsIds,
    }
  }

  getSubscriptions = (cb = () => {}) => {
    const { sandbox } = this.state

    axios
      .get(
        `/apps/customers/${this.props.match.params.userId}/subscriptions?sandbox=${sandbox}`
      )
      .then((response) => {
        this.allSubscriptions = response
        const {
          subscriptions,
          nonRenewableSubscriptionsIds,
        } = this.groupSubscriptions(response.data.data.results)

        this.setState(
          {
            currentSubscription: subscriptions[0],
            subscriptions,
            nonRenewableSubscriptionsIds,
          },
          cb
        )
      })
  }

  componentDidMount() {
    this.setState({ loading2: true })
  }

  componentWillMount() {
    const { sandbox } = this.state
    this.setState({ loading: true })
    this.props.fetchCustomerRequest(
      { id: this.props.match.params.userId, sandbox },
      (customer) => {
        const sandbox =
          localStorage.getItem('usersShow.sandbox') === null
            ? 0
            : parseFloat(localStorage.getItem('usersShow.sandbox'))
        let appsflyer_data
        let branch_data
        let tenjin_data
        let adjust_data
        let search_ads_data
        let properties = customer.properties

        for (const device of customer.devices) {
          if (device.appsflyer_data) appsflyer_data = device.appsflyer_data

          if (device.branch_data) branch_data = device.branch_data

          if (device.tenjin_data) tenjin_data = device.tenjin_data

          if (device.adjust_data) adjust_data = device.adjust_data

          if (device.search_ads_data) search_ads_data = device.search_ads_data
        }

        this.setState({
          adjust_data,
          appsflyer_data,
          branch_data,
          tenjin_data,
          search_ads_data,
          properties,
          currentDevice: customer.devices[0] ? customer.devices[0] : {},
          sandbox: customer.is_sandbox ? sandbox : 0,
        })

        this.getSubscriptions((subscriptions) => {
          document.title = 'Apphud | App user ' + customer.id
          setTimeout(() => {
            this.setState({ loading: false })
          })
        })
        this.setState({ loading2: false })
      }
    )
    window.scrollTo(0, 0)
  }

  handleChangeSubscription = (item) => {
    this.setState({
      currentSubscription: item,
      showReceipt: false,
      receipt: '',
    })
  }

  handleChangeDevice = (item) => {
    this.setState({ currentDevice: item })
  }

  toggleReceipt = () => {
    this.setState({ showReceipt: !this.state.showReceipt })

    if (!this.state.receipt) {
      this.setState({ loadingReceipt: true })
      axios
        .get(`/apple_receipt/${this.state.currentSubscription.id}`)
        .then((response) => {
          this.setState({
            receipt: JSON.stringify(response.data.data.results, null, '\t'),
            loadingReceipt: false,
          })
        })
    }
  }

  toggleAppsFlyer = () => {
    this.setState({ showAppsFlyer: !this.state.showAppsFlyer })
  }

  toggleBranch = () => {
    this.setState({ showBranch: !this.state.showBranch })
  }

  toggleTenjin = () => {
    this.setState({ showTenjin: !this.state.showTenjin })
  }

  toggleAdjust = () => {
    this.setState({ showAdjust: !this.state.showAdjust })
  }

  toggleSearchAds = () => {
    this.setState({ showSearchAds: !this.state.showSearchAds })
  }

  handleDeleteUser = () => {
    this.setState({ alertOpen: true })
  }

  handleCallbackAlert = (remove) => {
    if (remove) {
      const { appId, userId } = this.props.match.params
      axios.delete(`/apps/customers/${userId}`).then((response) => {
        NotificationManager.success('User successfully deleted', 'OK', 5000)
        history.push(`/apps/${appId}/users`)
      })
    }

    this.setState({ alertOpen: false })
  }

  onCopyToken = () => {
    this.setState({ copiedToken: true })
    setTimeout(() => {
      this.setState({ copiedToken: false })
    }, 1000)
  }

  handleChangeSandbox = ({ target }) => {
    localStorage.setItem('usersShow.sandbox', target.checked ? 1 : 0)
    this.setState({ sandbox: target.checked ? 1 : 0 }, () => {
      setTimeout(() => this.componentWillMount(), 200)
    })
  }

  render() {
    const { appId, userId } = this.props.match.params
    const { customer } = this.props
    const {
      subscriptions,
      loading,
      loadingReceipt,
      alertOpen,
      appsflyer_data,
      adjust_data,
      branch_data,
      tenjin_data,
      search_ads_data,
      properties,
      sandbox,
      currentSubscription,
      nonRenewableSubscriptionsIds,
      loading2
    } = this.state

    return (
      <div className="container-content container-content__blue">
        <SweetAlert
          isOpen={alertOpen}
          type="warning"
          title={'Delete user'}
          text="Do you really want to delete this user and all associated data?"
          confirmButtonText="Delete user"
          cancelButtonText="Cancel"
          callback={this.handleCallbackAlert}
        />
        <div className="container-content__blue-header">
          <div className="fl">
            <NavLink
              to={`/apps/${this.props.match.params.appId}/users`}
              className="button button_blue newapp-container__button"
            >
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
                  d="M3.41422 6.53554L6.94975 3L8.36396 4.41421L5.77817 7H13V9H5.87868L8.36396 11.4853L6.94975 12.8995L3.41421 9.36396L2 7.94975L3.41422 6.53554Z"
                  fill="white"
                />
              </svg>
            </NavLink>
            <span className="newapp-header__title">{customer.user_id}</span>
          </div>
          <div
            className="fr"
            style={
              !loading2 && customer.is_sandbox
                ? { visibility: 'visible' }
                : { visibility: 'hidden' }
            }
          >
            <label className="switcher switcher_orange">
              <input
                id="viewSandbox"
                onChange={this.handleChangeSandbox}
                checked={!!sandbox}
                type="checkbox"
                className="ios-switch green"
              />
              <div>
                <div></div>
              </div>
            </label>
            <label
              htmlFor="viewSandbox"
              className={
                'switcher-title users-sandbox__switcher-label ' +
                (sandbox ? ' switcher-title_active' : '')
              }
            >
              View Sandbox subscriptions
            </label>
            <button
              disabled={loading}
              className="button button_red button_icon button_160 users-delete__button"
              onClick={this.handleDeleteUser}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 2V1H6V2H2V4H14V2H10Z" fill="white" />
                <path
                  d="M3 5V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V5H3ZM7.5 12.5H6V7.5H7.5V12.5ZM10 12.5H8.5V7.5H10V12.5Z"
                  fill="white"
                />
              </svg>
              <span>Delete user</span>
            </button>
          </div>
          <div className="clear" />
        </div>
        <div className="container-content__blue-content">
          <div className="c-c__b-c__left">
            <div className="row">
              <div className="col span_3_of_12">
                <div className="c-c__b-c__box">
                  <div className="c-c__b-c__box-header">
                    <svg
                      className="c-c__b-c__box-header__icon"
                      width="10"
                      height="14"
                      viewBox="0 0 10 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2.5 1L0 0V14L2.5 13L5 14L7.5 13L10 14V0L7.5 1L5 0L2.5 1ZM6.5 4.5H5.5V4H4.5V4.5C4.10218 4.5 3.72064 4.65804 3.43934 4.93934C3.15804 5.22064 3 5.60218 3 6C3 6.39782 3.15804 6.77936 3.43934 7.06066C3.72064 7.34196 4.10218 7.5 4.5 7.5H5.5C5.77614 7.5 6 7.72386 6 8C6 8.27614 5.77614 8.5 5.5 8.5H4.5H3.5V9.5H4.5V10H5.5V9.5C5.89782 9.5 6.27936 9.34196 6.56066 9.06066C6.84196 8.77936 7 8.39783 7 8C7 7.60218 6.84196 7.22064 6.56066 6.93934C6.27936 6.65804 5.89782 6.5 5.5 6.5H4.5C4.22386 6.5 4 6.27614 4 6C4 5.72386 4.22386 5.5 4.5 5.5H5.5H6.5V4.5Z"
                        fill="#97ADC6"
                      />
                    </svg>
                    <span className="c-c__b-c__box-header-title">
                      Total spent
                    </span>
                  </div>
                  <div className="c-c__b-c__box-content">
                    {loading ? (
                      <div className="animated-background timeline-item" />
                    ) : (
                      <span className="c-c__b-c__box-content__description">
                        {parseFloat(customer.total_spent).toFixed(2)} USD
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="col span_3_of_12">
                <div className="c-c__b-c__box">
                  <div className="c-c__b-c__box-header">
                    <svg
                      className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_2"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="5" cy="6.5" r="3" fill="#97ADC6" />
                      <path
                        d="M10 15C10 13.6739 9.47322 12.4021 8.53553 11.4645C7.59785 10.5268 6.32608 10 5 10C3.67392 10 2.40215 10.5268 1.46447 11.4645C0.526784 12.4021 2.00233e-07 13.6739 0 15L5 15H10Z"
                        fill="#97ADC6"
                      />
                      <rect x="11" y="2" width="1" height="5" fill="#97ADC6" />
                      <rect x="9" y="4" width="5" height="1" fill="#97ADC6" />
                    </svg>
                    <span className="c-c__b-c__box-header-title">
                      Created at
                    </span>
                  </div>
                  <div className="c-c__b-c__box-content">
                    {loading ? (
                      <div className="animated-background timeline-item" />
                    ) : (
                      <span className="c-c__b-c__box-content__description">
                        <Moment
                          format="MMM DD, YYYY HH:mm"
                          date={customer.created_at}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="col span_3_of_12">
                <div className="c-c__b-c__box">
                  <div className="c-c__b-c__box-header">
                    <svg
                      className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_3"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 3C4.59091 3 1.67955 5.07333 0.5 8C1.67955 10.9267 4.59091 13 8 13C11.4091 13 14.3205 10.9267 15.5 8C14.3205 5.07333 11.4091 3 8 3ZM8 11.3333C6.11818 11.3333 4.59091 9.84 4.59091 8C4.59091 6.16 6.11818 4.66667 8 4.66667C9.88182 4.66667 11.4091 6.16 11.4091 8C11.4091 9.84 9.88182 11.3333 8 11.3333ZM8 6C6.86818 6 5.95455 6.89333 5.95455 8C5.95455 9.10667 6.86818 10 8 10C9.13182 10 10.0455 9.10667 10.0455 8C10.0455 6.89333 9.13182 6 8 6Z"
                        fill="#97ADC6"
                      />
                    </svg>
                    <span className="c-c__b-c__box-header-title">
                      Last seen
                    </span>
                  </div>
                  <div className="c-c__b-c__box-content">
                    {loading ? (
                      <div className="animated-background timeline-item" />
                    ) : (
                      <span className="c-c__b-c__box-content__description">
                        <Moment
                          format="MMM DD, YYYY HH:mm"
                          date={customer.last_seen_at}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="c-c__b-c__box c-c__b-c__box_table">
                <div className="c-c__b-c__box-header">
                  <svg
                    className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_2"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="4"
                      height="4"
                      rx="2"
                      fill="#97ADC6"
                    />
                    <rect
                      x="1"
                      y="6"
                      width="4"
                      height="4"
                      rx="2"
                      fill="#97ADC6"
                    />
                    <rect
                      x="1"
                      y="11"
                      width="4"
                      height="4"
                      rx="2"
                      fill="#97ADC6"
                    />
                    <rect x="7" y="2.5" width="7" height="1" fill="#97ADC6" />
                    <rect x="7" y="7.5" width="7" height="1" fill="#97ADC6" />
                    <rect x="7" y="12.5" width="7" height="1" fill="#97ADC6" />
                  </svg>
                  <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                    User properties
                  </span>
                  <div className="c-c__b-c__box-content c-c__b-c__box-content__table c-c__b-c__box-content__table_props">
                    <div className="c-c__b-c__box-table">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="column4">User ID</td>
                            <td className="column4">
                              {loading ? (
                                <div className="animated-background timeline-item" />
                              ) : (
                                customer.user_id
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="column4">Store Country</td>
                            <td
                              className={
                                'column4 ' &&
                                customer.currency &&
                                !customer.currency.country_code
                                  ? ' disabled-text'
                                  : ''
                              }
                            >
                              {loading ? (
                                <div className="animated-background timeline-item" />
                              ) : customer.currency &&
                                customer.currency.country_code ? (
                                customer.currency.country_code
                              ) : (
                                'None'
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="column4">Geo</td>
                            <td
                              className={
                                'column4 ' &&
                                (!customer.geo ? ' disabled-text' : '')
                              }
                            >
                              {loading ? (
                                <div className="animated-background timeline-item" />
                              ) : customer.geo ? (
                                customer.geo
                              ) : (
                                'None'
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="column4">Language</td>
                            <td
                              className={
                                'column4 ' &&
                                (!customer.locale ? ' disabled-text' : '')
                              }
                            >
                              {loading ? (
                                <div className="animated-background timeline-item" />
                              ) : customer.locale ? (
                                customer.locale.split('_')[0].toUpperCase()
                              ) : (
                                'None'
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="column4">Time zone</td>
                            <td
                              className={
                                'column4 ' &&
                                (!customer.time_zone ? ' disabled-text' : '')
                              }
                            >
                              {loading ? (
                                <div className="animated-background timeline-item" />
                              ) : customer.time_zone ? (
                                customer.time_zone
                              ) : (
                                'None'
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="column4">Last IP address</td>
                            <td
                              className={
                                'column4 ' &&
                                (!customer.ip ? ' disabled-text' : '')
                              }
                            >
                              {loading ? (
                                <div className="animated-background timeline-item" />
                              ) : customer.ip ? (
                                customer.ip
                              ) : (
                                'None'
                              )}
                            </td>
                          </tr>
                          {/* <tr>
                            <td className="column4">
                              Cohort
                            </td>
                            <td className={"column4 " && (!customer.cohort && " disabled-text")}>
                              {loading ? (
                                <div className="animated-background timeline-item" />
                              ) : (customer.cohort ? customer.cohort : "None")}
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {properties && (
              <div className="row">
                <div className="c-c__b-c__box c-c__b-c__box_table">
                  <div className="c-c__b-c__box-header">
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_2"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0 4.5C0 3.39543 0.895431 2.5 2 2.5H14C15.1046 2.5 16 3.39543 16 4.5V12.5C16 13.6046 15.1046 14.5 14 14.5H2C0.895431 14.5 0 13.6046 0 12.5V4.5ZM7 6.5C7 7.60457 6.10457 8.5 5 8.5C3.89543 8.5 3 7.60457 3 6.5C3 5.39543 3.89543 4.5 5 4.5C6.10457 4.5 7 5.39543 7 6.5ZM7.77164 11.3519C7.9224 11.7159 8 12.106 8 12.5H5H2C2 12.106 2.0776 11.7159 2.22836 11.3519C2.37913 10.988 2.6001 10.6573 2.87868 10.3787C3.15726 10.1001 3.48797 9.87913 3.85195 9.72836C4.21593 9.5776 4.60603 9.5 5 9.5C5.39397 9.5 5.78407 9.5776 6.14805 9.72836C6.51203 9.87913 6.84274 10.1001 7.12132 10.3787C7.3999 10.6573 7.62087 10.988 7.77164 11.3519ZM10 7.5H14V9.5H10V7.5ZM14 10.5H10V12.5H14V10.5Z"
                        fill="#97ADC6"
                      />
                    </svg>

                    <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                      User attributes
                    </span>
                  </div>
                  <div className="c-c__b-c__box-content c-c__b-c__box-content__table c-c__b-c__box-content__table_props">
                    <div className="c-c__b-c__box-table">
                      <table className="table">
                        <tbody>
                          {properties.map((item, index) => (
                            <Aux key={index}>
                              <tr key={index}>
                                <td className="column4">{item.name}</td>
                                <td
                                  className={
                                    !item.value
                                      ? 'column4 disabled-text'
                                      : 'column4'
                                  }
                                >
                                  {item.value ? item.value + '' : 'None'}
                                </td>
                              </tr>
                            </Aux>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adjust_data && (
              <div className="row">
                <div className="c-c__b-c__box c-c__b-c__box_table">
                  <div className="c-c__b-c__box-header">
                    <svg
                      className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="12" fill="#31B7C1" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.3823 10.8118L17.132 14.7003L13.4054 6.38913H13.3366L11.3823 10.8118ZM10.0672 10.1604L10.7389 8.58625C11.2649 7.37248 11.7949 6.15848 12.3169 4.9446C12.3558 4.80839 12.4881 4.72094 12.6285 4.73834C13.1302 4.73834 13.632 4.73834 14.1337 4.73834C14.2829 4.72025 14.4232 4.81274 14.4655 4.95673C15.5446 7.38462 16.633 9.81914 17.731 12.2603C18.3217 13.5796 18.9125 14.8971 19.5033 16.2138C19.5841 16.3294 19.5591 16.4886 19.4467 16.5737C19.0663 16.9338 18.7021 17.3143 18.3096 17.7068L17.2737 16.8976C15.1127 15.2169 12.8579 13.6608 10.5204 12.236C9.4768 11.596 8.35654 11.0901 7.18615 10.7308C6.95047 10.6611 6.70747 10.619 6.46194 10.6054C6.24263 10.5623 6.02984 10.7052 5.98681 10.9245C5.9725 10.9978 5.97856 11.0737 6.00466 11.1437C6.05468 11.409 6.13343 11.6682 6.23931 11.9165C6.70117 12.9059 7.28574 13.8329 7.97927 14.676L8.93424 12.6044C9.15263 13.0941 9.33887 13.5471 9.55337 13.9841C9.70492 14.2485 9.70492 14.5734 9.55337 14.8379C9.37126 15.1939 9.22154 15.5702 9.0637 15.9425C9.02867 16.0714 8.90505 16.1556 8.77239 16.141C8.27058 16.141 7.76889 16.141 7.26708 16.141C7.17414 16.142 7.08417 16.1074 7.01618 16.0437C6.17933 15.0288 5.47126 13.9144 4.9081 12.7258C4.65331 12.1819 4.51538 11.5903 4.50348 10.9899C4.44109 9.95924 5.22608 9.07341 6.25648 9.01091C6.33306 9.00645 6.40975 9.00645 6.48621 9.01114C7.36552 9.05818 8.22605 9.28391 9.01516 9.6748C9.34688 9.81227 9.68684 9.97824 10.0672 10.1604Z"
                        fill="white"
                      />
                    </svg>
                    <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                      Adjust attribution data
                    </span>
                    {this.state.showAdjust ? (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleAdjust}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Collapse
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.59 16L12 11.42L7.41 16L6 14.59L12 8.59L18 14.59L16.59 16Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleAdjust}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Expand
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.41 8.58997L12 13.17L16.59 8.58997L18 9.99997L12 16L6 9.99997L7.41 8.58997Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {this.state.showAdjust && (
                    <div className="c-c__b-c__box-content c-c__b-c__box-content__table c-c__b-c__box-content__table_props">
                      <div className="c-c__b-c__box-table">
                        <table className="table">
                          <tbody>
                            {Object.keys(adjust_data).map((key, index) => (
                              <Aux key={index}>
                                {typeof adjust_data[key] === 'object' &&
                                  Object.keys(adjust_data[key]).length > 0 && (
                                    <Aux>
                                      <tr key={index}>
                                        <td className="column4" colSpan="2">
                                          <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                                            {key}
                                          </span>
                                        </td>
                                      </tr>
                                      {Object.keys(adjust_data[key]).map(
                                        (k, i) =>
                                          adjust_data[key][k] !== null &&
                                          adjust_data[key][k] + '' && (
                                            <tr key={i}>
                                              <td className="column4">{k}</td>
                                              <td className="column4">
                                                {adjust_data[key][k] + ''}
                                              </td>
                                            </tr>
                                          )
                                      )}
                                    </Aux>
                                  )}

                                {typeof adjust_data[key] !== 'object' &&
                                  adjust_data[key] !== null &&
                                  adjust_data[key] + '' && (
                                    <tr key={index}>
                                      <td className="column4">{key}</td>
                                      <td className="column4">
                                        {adjust_data[key] + ''}
                                      </td>
                                    </tr>
                                  )}
                              </Aux>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {branch_data && (
              <div className="row">
                <div className="c-c__b-c__box c-c__b-c__box_table">
                  <div className="c-c__b-c__box-header">
                    <svg
                      className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="12" fill="white" />
                      <path
                        d="M24 11.9997C24 5.38128 18.6167 0 12.0003 0C5.38401 0 0 5.38128 0 11.9997C0 18.2522 4.80684 23.4023 10.9192 23.9501H10.9486C11.0489 23.9587 11.1494 23.9663 11.2501 23.9726L11.3083 23.9761C11.3995 23.9815 11.492 23.9856 11.5859 23.9884H11.6591C11.7726 23.9884 11.8861 23.9938 12.001 23.9938C12.1159 23.9938 12.2178 23.9938 12.3259 23.9891H12.3717C12.467 23.9863 12.5618 23.9824 12.6562 23.9774H12.6753C12.8882 23.9656 13.0998 23.948 13.3099 23.9248C19.3122 23.2737 24 18.1742 24 11.9997ZM13.2689 22.7827L13.1533 19.464L16.0515 17.6859C16.7297 18.1508 17.6115 18.1956 18.3333 17.8017C19.0551 17.4079 19.4946 16.6423 19.4708 15.8204C19.4244 14.6693 18.5019 13.7469 17.3508 13.7004C16.6987 13.677 16.0706 13.9481 15.6403 14.4386C15.21 14.9291 15.023 15.5872 15.131 16.2307L13.0856 17.4958L12.9372 13.314L15.7896 11.5695C16.7916 12.3178 18.1868 12.2366 19.0953 11.3772C20.0037 10.5177 20.1621 9.12916 19.4704 8.08721C18.7787 7.04526 17.4377 6.65208 16.2929 7.15559C15.1481 7.65911 14.5316 8.91328 14.8322 10.1273L12.8688 11.3459L12.7526 8.00866C13.6867 7.64746 14.2871 6.73141 14.2454 5.73073C14.1968 4.5639 13.2944 3.61202 12.1318 3.5012C10.9693 3.39039 9.9033 4.15465 9.6351 5.29127C9.36689 6.4279 9.97877 7.58807 11.0682 8.00866L10.8562 14.9232L8.71919 13.5616C8.86177 12.9789 8.7937 12.3646 8.52703 11.8273C8.09962 10.9383 7.23795 10.3078 6.25525 10.2462C5.03992 10.1669 3.92108 10.9085 3.52065 12.0587C3.12023 13.2089 3.53669 14.4849 4.53854 15.1775C5.54039 15.87 6.88126 15.8088 7.81581 15.0278L10.7947 16.9125L10.6155 22.7697C5.28144 22.0893 1.13862 17.5191 1.13862 11.9997C1.14273 6.01316 6.01316 1.14136 12.0003 1.14136C17.9875 1.14136 22.858 6.0118 22.858 11.999C22.858 17.5574 18.6598 22.1522 13.2689 22.7827Z"
                        fill="#333E48"
                      />
                      <path
                        d="M11.9318 4.42157C12.7121 4.42232 13.3445 5.05469 13.3452 5.83498C13.3452 6.61558 12.7124 7.24839 11.9318 7.24839C11.1512 7.24839 10.5184 6.61558 10.5184 5.83498C10.5184 5.05437 11.1512 4.42157 11.9318 4.42157ZM17.2602 14.6066C17.9681 14.6062 18.5428 15.1785 18.5455 15.8863C18.5468 16.4055 18.2353 16.8743 17.7562 17.0741C17.277 17.2739 16.7247 17.1653 16.3569 16.799C15.989 16.4327 15.8781 15.8809 16.0759 15.4009C16.2736 14.9209 16.7411 14.6074 17.2602 14.6066ZM18.0511 10.8838C17.3014 11.2482 16.3981 10.9367 16.0323 10.1877C15.7647 9.63858 15.8542 8.98232 16.2591 8.52496C16.6641 8.0676 17.3047 7.89922 17.8822 8.09835C18.4597 8.29748 18.8603 8.8249 18.8973 9.43464C18.9343 10.0444 18.6003 10.6164 18.0511 10.8838ZM6.03375 11.3038C6.93303 11.3046 7.66186 12.0334 7.66261 12.9327C7.66224 13.8317 6.93325 14.5603 6.0342 14.5602C5.13516 14.5601 4.40638 13.8313 4.40625 12.9323C4.40612 12.0332 5.13471 11.3042 6.03375 11.3038Z"
                        fill="#009BDE"
                      />
                    </svg>
                    <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                      Branch attribution data
                    </span>
                    {this.state.showBranch ? (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleBranch}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Collapse
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.59 16L12 11.42L7.41 16L6 14.59L12 8.59L18 14.59L16.59 16Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleBranch}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Expand
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.41 8.58997L12 13.17L16.59 8.58997L18 9.99997L12 16L6 9.99997L7.41 8.58997Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {this.state.showBranch && (
                    <div className="c-c__b-c__box-content c-c__b-c__box-content__table c-c__b-c__box-content__table_props">
                      <div className="c-c__b-c__box-table">
                        <table className="table">
                          <tbody>
                            {Object.keys(branch_data).map((key, index) => (
                              <Aux key={index}>
                                {typeof branch_data[key] === 'object' &&
                                  Object.keys(branch_data[key]).length > 0 && (
                                    <Aux>
                                      <tr key={index}>
                                        <td className="column4" colSpan="2">
                                          <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                                            {key}
                                          </span>
                                        </td>
                                      </tr>
                                      {Object.keys(branch_data[key]).map(
                                        (k, i) =>
                                          branch_data[key][k] !== null &&
                                          branch_data[key][k] + '' && (
                                            <tr key={i}>
                                              <td className="column4">{k}</td>
                                              <td className="column4">
                                                {branch_data[key][k] + ''}
                                              </td>
                                            </tr>
                                          )
                                      )}
                                    </Aux>
                                  )}
                                {typeof branch_data[key] !== 'object' &&
                                  branch_data[key] !== null &&
                                  branch_data[key] + '' && (
                                    <tr key={index}>
                                      <td className="column4">{key}</td>
                                      <td className="column4">
                                        {branch_data[key] + ''}
                                      </td>
                                    </tr>
                                  )}
                              </Aux>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {tenjin_data && (
              <div className="row">
                <div className="c-c__b-c__box c-c__b-c__box_table">
                  <div className="c-c__b-c__box-header">
                    <svg
                      className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="12" fill="white" />
                      <path
                        d="M24 12.0715C23.9917 18.7416 18.6756 24.0067 11.9558 24C5.27732 23.9941 -0.0123779 18.6791 2.1755e-05 11.9846C0.0107681 5.34574 5.43769 -0.0536002 12.0442 0.000401579C18.7144 0.056091 24.0091 5.40227 24 12.0715ZM11.9872 22.8719C17.9903 22.8744 22.8774 18.026 22.9039 12.0403C22.9311 6.1313 17.9531 1.14372 12.0136 1.12938C6.09239 1.11503 1.0945 6.09501 1.09367 12.0124C1.09367 17.9813 5.99733 22.8702 11.9872 22.8719Z"
                        fill="#5A95C9"
                      />
                      <path
                        d="M17.9811 19.6415C16.9511 20.3904 15.9104 20.4218 14.8242 20.0002C13.4321 19.4596 12.3988 18.5486 11.8681 17.1558C11.5703 16.3661 11.292 15.5692 11.0332 14.7659C10.0156 11.6412 6.5379 10.3541 3.64547 12.043C3.25116 12.2728 2.87255 12.5265 2.46833 12.7803C2.23025 11.7842 2.52371 10.9865 3.43385 10.221C5.14913 8.77854 7.1306 8.82317 9.17572 9.28857C9.62707 9.39108 10.0677 9.55641 10.5231 9.61097C13.8636 10.0168 16.4841 7.48566 16.2344 4.11378C16.2129 3.83024 16.1815 3.54753 16.1526 3.24084C17.2496 3.56241 17.9133 4.53041 18.0084 5.83816C18.1655 7.97504 17.109 9.57046 15.6169 10.9634C14.625 11.8892 13.876 12.9308 13.833 14.322C13.7644 16.5325 14.8349 18.0923 16.7784 19.1248C17.1437 19.3183 17.5414 19.4538 17.9811 19.6415Z"
                        fill="#5A95C9"
                      />
                    </svg>
                    <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                      Tenjin attribution data
                    </span>
                    {this.state.showTenjin ? (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleTenjin}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Collapse
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.59 16L12 11.42L7.41 16L6 14.59L12 8.59L18 14.59L16.59 16Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleTenjin}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Expand
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.41 8.58997L12 13.17L16.59 8.58997L18 9.99997L12 16L6 9.99997L7.41 8.58997Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {this.state.showTenjin && (
                    <div className="c-c__b-c__box-content c-c__b-c__box-content__table c-c__b-c__box-content__table_props">
                      <div className="c-c__b-c__box-table">
                        <table className="table">
                          <tbody>
                            {Object.keys(tenjin_data).map((key, index) => (
                              <Aux key={index}>
                                {typeof tenjin_data[key] === 'object' &&
                                  Object.keys(tenjin_data[key]).length > 0 && (
                                    <Aux>
                                      <tr key={index}>
                                        <td className="column4" colSpan="2">
                                          <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                                            {key}
                                          </span>
                                        </td>
                                      </tr>
                                      {Object.keys(tenjin_data[key]).map(
                                        (k, i) =>
                                          tenjin_data[key][k] !== null &&
                                          tenjin_data[key][k] + '' && (
                                            <tr key={i}>
                                              <td className="column4">{k}</td>
                                              <td className="column4">
                                                {tenjin_data[key][k] + ''}
                                              </td>
                                            </tr>
                                          )
                                      )}
                                    </Aux>
                                  )}

                                {typeof tenjin_data[key] !== 'object' &&
                                  tenjin_data[key] !== null &&
                                  tenjin_data[key] + '' && (
                                    <tr key={index}>
                                      <td className="column4">{key}</td>
                                      <td className="column4">
                                        {tenjin_data[key] + ''}
                                      </td>
                                    </tr>
                                  )}
                              </Aux>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {appsflyer_data && (
              <div className="row">
                <div className="c-c__b-c__box c-c__b-c__box_table">
                  <div className="c-c__b-c__box-header">
                    <svg
                      className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="12" fill="#EDF3F8" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.06883 9.06904L6.45702 13.5778C6.62021 13.8851 7.02174 14.1346 7.35376 14.1339L12.2234 14.1221C12.556 14.1214 12.693 13.8712 12.5306 13.5639L10.1417 9.05516C9.97858 8.74739 9.57704 8.49848 9.24503 8.49909L4.37539 8.51096C4.36774 8.51096 4.3607 8.51096 4.35305 8.51096C4.03684 8.52273 3.90916 8.76832 4.06883 9.06904Z"
                        fill="#7CAB41"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.3203 14.3212L14.7667 16.9958C14.8651 17.1783 15.1053 17.3248 15.3037 17.3224L18.2047 17.2917C18.4031 17.2893 18.4832 17.1397 18.3848 16.9573L16.9389 14.2827C16.8405 14.1001 16.5991 13.9543 16.4019 13.9561L13.5003 13.9868H13.4903C13.2995 13.9939 13.2237 14.1417 13.3203 14.3212Z"
                        fill="#7CAB41"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.3346 4.16397L10.4344 7.85748C10.2361 8.11011 10.2097 8.56215 10.3758 8.86881L12.8023 13.3575C12.9679 13.6637 13.2627 13.7078 13.4604 13.4557L16.3612 9.76163C16.5589 9.5096 16.5853 9.05685 16.4192 8.7508L13.9928 4.26207C13.8967 4.08489 13.7577 3.99545 13.6194 4.00018C13.5188 4.0043 13.4181 4.05793 13.3346 4.16397Z"
                        fill="#1585BB"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.6577 14.3662L10.9293 16.5671C10.8109 16.7172 10.7958 16.9869 10.8941 17.1694L12.34 19.844C12.4389 20.0264 12.6144 20.0529 12.7327 19.9022L14.4605 17.7018C14.5782 17.5511 14.594 17.2815 14.4957 17.0996L13.0498 14.4243C12.9927 14.319 12.9097 14.2661 12.8267 14.2684C12.7672 14.2708 12.7071 14.3026 12.6577 14.3662Z"
                        fill="#1585BB"
                      />
                    </svg>
                    <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                      AppsFlyer attribution data
                    </span>
                    {this.state.showAppsFlyer ? (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleAppsFlyer}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Collapse
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.59 16L12 11.42L7.41 16L6 14.59L12 8.59L18 14.59L16.59 16Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleAppsFlyer}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Expand
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.41 8.58997L12 13.17L16.59 8.58997L18 9.99997L12 16L6 9.99997L7.41 8.58997Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {this.state.showAppsFlyer && (
                    <div className="c-c__b-c__box-content c-c__b-c__box-content__table c-c__b-c__box-content__table_props">
                      <div className="c-c__b-c__box-table">
                        <table className="table">
                          <tbody>
                            {Object.keys(appsflyer_data).map((key, index) => (
                              <tr key={index}>
                                <td className="column4">{key}</td>
                                <td className="column4">
                                  {appsflyer_data[key] + ''}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {search_ads_data && (
              <div className="row">
                <div className="c-c__b-c__box c-c__b-c__box_table">
                  <div className="c-c__b-c__box-header">
                    <svg
                      className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM16.9826 16.4794C17.278 16.0581 17.5331 15.6 17.7485 15.1022C17.8373 14.8912 17.9209 14.6713 18 14.4418C17.6351 14.2888 17.3071 14.0734 17.0133 13.7946C16.3652 13.194 16.0355 12.4376 16.0258 11.5285C16.0152 10.3615 16.5455 9.4518 17.6175 8.80229C17.0186 7.95105 16.1181 7.47856 14.9195 7.38183C14.4772 7.34428 13.9373 7.4396 13.2975 7.66982C12.621 7.91807 12.222 8.04259 12.1042 8.04259C11.9467 8.04259 11.5875 7.9361 11.028 7.7261C10.467 7.51681 10.0155 7.41032 9.67123 7.41032C9.04204 7.42078 8.45778 7.58435 7.91705 7.90532C7.37632 8.2263 6.94428 8.66352 6.61952 9.21779C6.2063 9.90784 6 10.7313 6 11.686C6 12.5195 6.15301 13.3804 6.45824 14.2695C6.74325 15.0926 7.10705 15.8145 7.54955 16.4371C7.96198 17.0202 8.30626 17.4317 8.5815 17.6718C9.01275 18.0728 9.44479 18.2636 9.87823 18.2451C10.1632 18.2355 10.536 18.1379 10.9987 17.9506C11.4608 17.7641 11.8927 17.6718 12.2955 17.6718C12.6795 17.6718 13.0995 17.7641 13.5565 17.9506C14.012 18.1379 14.4033 18.2302 14.7278 18.2302C15.1798 18.2196 15.6019 18.0341 15.9959 17.6718C16.25 17.4511 16.5798 17.0536 16.9826 16.4794ZM14.2204 6.27847C14.7393 5.66273 14.9996 4.99749 14.9996 4.28501V4.285C14.9996 4.1905 14.9952 4.09525 14.9846 4C14.6232 4.01875 14.2389 4.12825 13.8326 4.32625C13.4255 4.52725 13.0897 4.77922 12.8257 5.08225C12.297 5.68076 11.9992 6.41275 11.9992 7.09673C11.9992 7.19127 12.0053 7.28123 12.0157 7.3667C12.837 7.43345 13.5943 7.01047 14.2204 6.27847Z"
                        fill="#808080"
                      />
                    </svg>
                    <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                      Apple Search Ads attribution data
                    </span>
                    {this.state.showSearchAds ? (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleSearchAds}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Collapse
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.59 16L12 11.42L7.41 16L6 14.59L12 8.59L18 14.59L16.59 16Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleSearchAds}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Expand
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.41 8.58997L12 13.17L16.59 8.58997L18 9.99997L12 16L6 9.99997L7.41 8.58997Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {this.state.showSearchAds && (
                    <div className="c-c__b-c__box-content c-c__b-c__box-content__table c-c__b-c__box-content__table_props">
                      <div className="c-c__b-c__box-table">
                        <table className="table">
                          <tbody>
                            {Object.keys(search_ads_data).map((key, index) => (
                              <tr key={index}>
                                <td className="column4">{key}</td>
                                <td className="column4">
                                  {search_ads_data[key] + ''}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="row">
              {this.state.currentDevice && (
                <div className="c-c__b-c__box c-c__b-c__box_table">
                  {loading ? (
                    <div className="animated-background timeline-item" />
                  ) : (
                    <div
                      className={
                        'c-c__b-c__box-header ' &&
                        (customer.devices && customer.devices.length > 1
                          ? 'c-c__b-c__box-header_select'
                          : '')
                      }
                    >
                      <svg
                        className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_3"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5 1C4.44772 1 4 1.44772 4 2V14C4 14.5523 4.44772 15 5 15H11C11.5523 15 12 14.5523 12 14V2C12 1.44772 11.5523 1 11 1H5ZM11 3H5V13H11V3Z"
                          fill="#97ADC6"
                        />
                      </svg>
                      {customer.devices && customer.devices.length > 1 && (
                        <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                          <CustomSelect
                            className="users__custom-select"
                            value={this.state.currentDevice}
                            onChange={this.handleChangeDevice}
                            title="Devices"
                            labelKey="device_type"
                            valueKey="id"
                            options={customer.devices}
                          />
                        </span>
                      )}
                      {customer.devices && customer.devices.length === 1 && (
                        <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                          {customer.devices[0].device_type}
                        </span>
                      )}
                      {customer.devices.length === 0 && (
                        <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3 disabled-text">
                          No devices
                        </span>
                      )}
                    </div>
                  )}

                  {loading ? (
                    <div className="animated-background timeline-item" />
                  ) : (
                    <div className="c-c__b-c__box-content c-c__b-c__box-content__table c-c__b-c__box-content__table_props">
                      <div className="c-c__b-c__box-table">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td className="column4">Device ID</td>
                              <td className="column4">
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : (
                                  this.state.currentDevice.device_id
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>IDFA</td>
                              <td>
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : (
                                  this.state.currentDevice.idfa
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>IDFV</td>
                              <td>
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : (
                                  this.state.currentDevice.idfv
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="column4">Platform</td>
                              <td className="column4">
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : (
                                  this.state.currentDevice.platform
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="column4">Device family</td>
                              <td
                                className={
                                  'column4 ' &&
                                  (!this.state.currentDevice.device_family
                                    ? ' disabled-text'
                                    : '')
                                }
                              >
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : this.state.currentDevice.device_family ? (
                                  this.state.currentDevice.device_family
                                ) : (
                                  'None'
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="column4">Device model</td>
                              <td
                                className={
                                  'column4 ' &&
                                  (!this.state.currentDevice.device_type
                                    ? ' disabled-text'
                                    : '')
                                }
                              >
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : this.state.currentDevice.device_type ? (
                                  this.state.currentDevice.device_type
                                ) : (
                                  'None'
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="column4">OS version</td>
                              <td
                                className={
                                  'column4 ' &&
                                  (!this.state.currentDevice.os_version
                                    ? ' disabled-text'
                                    : '')
                                }
                              >
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : this.state.currentDevice.os_version ? (
                                  this.state.currentDevice.os_version
                                ) : (
                                  'None'
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="column4">Current app version</td>
                              <td
                                className={
                                  'column4 ' &&
                                  (!this.state.currentDevice.app_version
                                    ? ' disabled-text'
                                    : '')
                                }
                              >
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : this.state.currentDevice.app_version ? (
                                  this.state.currentDevice.app_version
                                ) : (
                                  'None'
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="column4">Start app version</td>
                              <td
                                className={
                                  'column4 ' &&
                                  (!this.state.currentDevice.start_app_version
                                    ? ' disabled-text'
                                    : '')
                                }
                              >
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : this.state.currentDevice
                                    .start_app_version ? (
                                  this.state.currentDevice.start_app_version
                                ) : (
                                  'None'
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="column4">Apphud SDK version</td>
                              <td
                                className={
                                  'column4 ' &&
                                  (!this.state.currentDevice.sdk_version
                                    ? ' disabled-text'
                                    : '')
                                }
                              >
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : this.state.currentDevice.sdk_version ? (
                                  this.state.currentDevice.sdk_version
                                ) : (
                                  'None'
                                )}
                              </td>
                            </tr>
                            {/* <tr>
                              <td className="column4">
                                Carrier
                              </td>
                              <td className={"column4 " && (!this.state.currentDevice.carrier ? " disabled-text" : "")}>
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : (this.state.currentDevice.carrier ? this.state.currentDevice.carrier : "None")}
                              </td>
                            </tr>
                            <tr>
                              <td className="column4">
                                IDFA
                              </td>
                              <td className={"column4 " && (!this.state.currentDevice.idfa ? " disabled-text" : "")}>
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : (this.state.currentDevice.idfa ? this.state.currentDevice.idfa : "None")}
                              </td>
                            </tr>
                            <tr>
                              <td className="column4">
                                IDFV
                              </td>
                              <td className={"column4 " && (!this.state.currentDevice.idfv ? " disabled-text" : "")}>
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : (this.state.currentDevice.idfv ? this.state.currentDevice.idfv : "None")}
                              </td>
                            </tr> */}
                            <tr>
                              <td className="va-middle column4">Push token</td>
                              <td
                                className={
                                  'column4 ' &&
                                  (!this.state.currentDevice.push_token
                                    ? ' disabled-text'
                                    : '')
                                }
                              >
                                {loading ? (
                                  <div className="animated-background timeline-item" />
                                ) : this.state.currentDevice.push_token ? (
                                  <div>
                                    <input
                                      value={
                                        this.state.currentDevice.push_token
                                      }
                                      onChange={() => {}}
                                      onMouseUp={(e) => {
                                        e.target.select()
                                      }}
                                      id="push_token"
                                      placeholder="App name"
                                      readOnly={true}
                                      type="text"
                                      name="name"
                                      required=""
                                      className={
                                        'input input_stretch input_blue input_copy'
                                      }
                                    />
                                    <CopyToClipboard
                                      text={this.state.currentDevice.push_token}
                                      onCopy={this.onCopyToken}
                                    >
                                      <span
                                        className="input_copy-text"
                                        style={{ top: 3 }}
                                      >
                                        {!this.state.copiedToken && 'Copy'}
                                        {this.state.copiedToken && 'Copied'}
                                      </span>
                                    </CopyToClipboard>
                                  </div>
                                ) : (
                                  'None'
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {subscriptions.length > 0 && (
              <div className="row">
                <div className="c-c__b-c__box c-c__b-c__box_table">
                  <div className="c-c__b-c__box-header">
                    <svg
                      className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_2"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 2.04026C3 1.62101 3.48497 1.38792 3.81235 1.64982L5.18765 2.75007C5.37026 2.89616 5.62974 2.89616 5.81235 2.75007L7.68765 1.24982C7.87026 1.10374 8.12974 1.10374 8.31235 1.24982L10.1877 2.75007C10.3703 2.89616 10.6297 2.89616 10.8123 2.75007L12.1877 1.64982C12.515 1.38792 13 1.62101 13 2.04026V13.9596C13 14.3789 12.515 14.612 12.1877 14.3501L10.5 12.9999L8.31235 14.7501C8.12974 14.8962 7.87026 14.8962 7.68765 14.7501L5.5 12.9999L3.81235 14.3501C3.48497 14.612 3 14.3789 3 13.9596V2.04026ZM5 4.99995H8V6.99995H5V4.99995ZM11 4.99995H9V6.99995H11V4.99995ZM8 8.99995H11V10.9999H8V8.99995ZM7 8.99995H5V10.9999H7V8.99995Z"
                        fill="#97ADC6"
                      />
                    </svg>
                    <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                      Receipt
                    </span>
                    {this.state.showReceipt ? (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleReceipt}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Collapse
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.59 16L12 11.42L7.41 16L6 14.59L12 8.59L18 14.59L16.59 16Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div
                        className="c-c__b-c__box-header-title__right-expand"
                        onClick={this.toggleReceipt}
                      >
                        <span className="c-c__b-c__box-header-title__right">
                          Expand
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.41 8.58997L12 13.17L16.59 8.58997L18 9.99997L12 16L6 9.99997L7.41 8.58997Z"
                            fill="#0085FF"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {this.state.showReceipt && (
                    <div className="c-c__b-c__box-content c-c__b-c__box-content__table c-c__b-c__box-content__table_props">
                      {loadingReceipt && (
                        <div>
                          <div className="animated-background timeline-item" />
                        </div>
                      )}
                      {!loadingReceipt && (
                        <AceEditor
                          value={this.state.receipt}
                          showPrintMargin={false}
                          mode="json"
                          theme="github"
                          name="UNIQUE_ID_OF_DIV"
                          readOnly={true}
                          wrapEnabled
                          width="100%"
                          height="500px"
                          editorProps={{ $blockScrolling: Infinity }}
                          tabSize={2}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="c-c__b-c__right">
            <Promotionals appId={appId} userId={userId} />
            {loading && (
              <div className="c-c__b-c__box">
                <div className="animated-background timeline-item" />
              </div>
            )}
            {!loading && subscriptions.length > 0 && (
              <div className="c-c__b-c__box">
                <div
                  className={
                    'c-c__b-c__box-header ' &&
                    (subscriptions && subscriptions.length > 1
                      ? 'c-c__b-c__box-header_select'
                      : '')
                  }
                >
                  <svg
                    className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_3"
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
                  {subscriptions && subscriptions.length > 1 && (
                    <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                      <CustomSelect
                        className="users__custom-select"
                        value={this.state.currentSubscription}
                        onChange={this.handleChangeSubscription}
                        title="Product groups"
                        options={subscriptions}
                        subscriptions={true}
                      />
                    </span>
                  )}
                  {subscriptions && subscriptions.length === 1 && (
                    <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                      {subscriptions[0].product_group_name}
                    </span>
                  )}
                </div>

                <div className="c-c__b-c__box-content">
                  {loading ? (
                    <div className="animated-background timeline-item" />
                  ) : (
                    this.state.currentSubscription && (
                      <UserFeed
                        appId={appId}
                        nonRenewableSubscriptionsIds={
                          nonRenewableSubscriptionsIds
                        }
                        currentSubscription={currentSubscription}
                        subscriptionId={
                          currentSubscription && currentSubscription.id
                        }
                        customer={this.props.customer}
                        userId={this.props.match.params.userId}
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    customer: state.customer,
    user: state.sessions,
  }
}

const mapDispatchToProps = {
  fetchCustomerRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersShow)
