import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import $ from 'jquery'
import { MAX_TO_EXPORT_USERS_FOR_FREE_PLAN } from '../../../../constants'
import {track} from "../../../../libs/helpers";

const customStylesPopUp = {
  content: {
    position: 'relative',
    margin: 'auto',
    padding: 0,
    borderRadius: 8,
    width: 410,
    overlfow: 'visible',
  },
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}

const fields = {
  created_at: 'User created at',
  last_seen_at: 'User last seen at',
  subscription_status: 'Subscription status',
  autorenewal_status: 'Autorenewal status',
  total_spent: 'Total spent',
  payments_count: 'Purchases count',
  geo: 'Geo',
  currency: 'Currency',
  store_country: 'Store country',
  ip_address: 'IP address',
  language: 'Language',
  last_device_idfa: 'Last device IDFA',
  push_token: 'Push token',
}

class ExportModal extends Component {
  state = {
    exportInProgress: false,
    usersCount: 0,
    result: {
      id: true,
      created_at: true,
      last_seen_at: true,
      subscription_status: true,
      autorenewal_status: true,
      total_spent: true,
      payments_count: true,
      geo: true,
      currency: true,
      store_country: true,
      ip_address: true,
      language: true,
      last_device_idfa: true,
      push_token: true,
    },
    loadingUserCount: false,
  }

  buildParams = () => {
    const {
      filters,
      query,
      order,
      sandbox,
      sortBy,
      currentPeriod,
    } = this.props.parentState
    const { start_time, end_time } = currentPeriod

    const params = {
      order: order ? 'asc' : 'desc',
      sort_by: sortBy,
      q: query,
      sandbox,
      start_time,
      end_time,
    }

    for (const filter of filters) params[filter.value] = filter.equal

    return $.param(params)
  }

  handleExport = () => {
    const { appId } = this.props
    this.setState({ exporting: true })
    const paramsString = this.buildParams()
    track("users_export_submitted")
    axios
      .post(
        `/apps/${appId}/customers/export?${paramsString}`,
        this.state.result
      )
      .then(
        (response) => {
          this.setState({ exportInProgress: true, exporting: false })
        },
        () => {
          this.setState({ exporting: false })
        }
      )
  }

  getUsersCount = () => {
    const { appId } = this.props
    const paramsString = this.buildParams()

    this.setState({ loadingUserCount: true })
    axios
      .get(`/apps/${appId}/customers?${paramsString}`, this.state.result)
      .then((response) => {
        this.setState({ usersCount: response.data.data.meta.total_count, loadingUserCount: false })
      })
  }

  onChangeField = (key, e) => {
    this.setState({
      result: Object.assign(this.state.result, { [key]: e.target.checked }),
    })
  }

  componentWillMount() {
    this.getUsersCount()
  }

  render() {
    const { exportInProgress, exporting, usersCount, loadingUserCount } = this.state
    const { handleToggleExportUsers } = this.props
    const { user } = this.props.application

    return exportInProgress ? (
      <Modal
        isOpen={true}
        className="ReactModal__Content ReactModal__Content-visible"
        onRequestClose={handleToggleExportUsers}
        ariaHideApp={false}
        style={customStylesPopUp}
        shouldFocusAfterRender={false}
        contentLabel="Add filter"
      >
        <div
          style={{ padding: '20px 30px' }}
          className="purchase-screen__edit-insert__macros-modal"
        >
          <div className="newapp-header__title">Export in progress</div>
          <div className="mt15">
            We will notify you by email when export will be ready for download.
          </div>
          <div className="ta-center mt20">
            <button
              onClick={handleToggleExportUsers}
              className="button button_green button_160"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    ) : (
        <Modal
          isOpen={true}
          className="ReactModal__Content ReactModal__Content-visible"
          onRequestClose={handleToggleExportUsers}
          ariaHideApp={false}
          style={customStylesPopUp}
          shouldFocusAfterRender={false}
          contentLabel="Add filter"
        >
          <div
            style={{ padding: '20px 30px' }}
            className="purchase-screen__edit-insert__macros-modal"
          >
            <div className="newapp-header__title">Export users</div>
            {user && user.subscription.plan.free && (
              <div className="dashboard-checklist dashboard-checklist_mb0 mt10">
                <div className="dashboard-checklist__content dashboard-checklist__content_m0">
                  You can export up to{' '}
                  <NumberFormat
                    value={MAX_TO_EXPORT_USERS_FOR_FREE_PLAN}
                    displayType={'text'}
                    thousandSeparator={true}
                  />{' '}
                users on Free plan.{' '}
                  <NavLink to="/profile/billing" className="link">
                    Upgrade
                </NavLink>{' '}
                to export more.
              </div>
              </div>
            )}
            <div className="mt15 users-export__modal-label">
              Choose fields to export:
          </div>
            <div className="users-export__list">
              <div className="container-content__integrations-settings__content-inputs__checkbox radio_disabled ta-left">
                <input
                  disabled={true}
                  id={'id'}
                  onChange={() => { }}
                  checked={true}
                  type="checkbox"
                  className="checkbox"
                />
                <label
                  htmlFor={'id'}
                  title="User Id"
                  className="checkbox-label-wrapper"
                >
                  <div className="checkbox-label checkbox-label_small fl">
                    <svg
                      width="11px"
                      className="icon-check"
                      height="8px"
                      viewBox="0 0 11 8"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {' '}
                      <defs></defs>{' '}
                      <g
                        id="Symbols"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {' '}
                        <g
                          id="ui/check-on"
                          transform="translate(-3.000000, -4.000000)"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        >
                          {' '}
                          <g id="Shape">
                            {' '}
                            <polyline points="13 5 7 11 4 8"></polyline>{' '}
                          </g>{' '}
                        </g>{' '}
                      </g>{' '}
                    </svg>
                  </div>
                  <span className="label-text">User ID</span>
                </label>
              </div>
              {Object.keys(fields).map((key) => (
                <div
                  className="container-content__integrations-settings__content-inputs__checkbox ta-left"
                  key={key}
                >
                  <input
                    id={key}
                    onChange={this.onChangeField.bind(null, key)}
                    checked={this.state.result[key]}
                    type="checkbox"
                    className="checkbox"
                  />
                  <label
                    htmlFor={key}
                    title="User Id"
                    className="checkbox-label-wrapper"
                  >
                    <div className="checkbox-label checkbox-label_small fl">
                      <svg
                        width="11px"
                        className="icon-check"
                        height="8px"
                        viewBox="0 0 11 8"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {' '}
                        <defs></defs>{' '}
                        <g
                          id="Symbols"
                          stroke="none"
                          strokeWidth="1"
                          fill="none"
                          fillRule="evenodd"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {' '}
                          <g
                            id="ui/check-on"
                            transform="translate(-3.000000, -4.000000)"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                          >
                            {' '}
                            <g id="Shape">
                              {' '}
                              <polyline points="13 5 7 11 4 8"></polyline>{' '}
                            </g>{' '}
                          </g>{' '}
                        </g>{' '}
                      </svg>
                    </div>
                    <span className="label-text">{fields[key]}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt10">
              <b>
                Users to export:{' '}
                <NumberFormat
                  value={usersCount}
                  displayType={'text'}
                  thousandSeparator={true}
                />
              </b>
            </div>
            <div className="input-wrapper">
              <button
                className="button button_blue popup-button fl"
                onClick={handleToggleExportUsers}
              >
                <span>Cancel</span>
              </button>
              <button
                disabled={
                  exporting ||
                  (user &&
                    user.subscription.plan.free &&
                    usersCount > MAX_TO_EXPORT_USERS_FOR_FREE_PLAN) ||
                  loadingUserCount
                }
                onClick={this.handleExport}
                className="button button_green button_160 fr"
              >
                {loadingUserCount ? 'Please, wait...' : 'Export'}
              </button>
            </div>
          </div>
        </Modal>
      )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application,
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ExportModal)
