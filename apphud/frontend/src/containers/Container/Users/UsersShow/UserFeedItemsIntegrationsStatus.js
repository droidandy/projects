import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import Tooltip from "rc-tooltip"
import Moment from "react-moment"
import Tip from "../../../Common/Tip"
import Modal from "react-modal"
import ExpandText from "../../../Common/ExpandText"
import axios from "axios"
import {track} from "../../../../libs/helpers";

const FAILED = "failed"
const SENT = "sent"
const BLOCKED = "blocked"
const SKIPPED = "skipped"
const PENDING = "pending"
const DISABLED = "disabled"
const ICONS = {
  error: (
    <svg
      className="va-middle"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.723562 12.0528L6.10553 1.28887C6.47405 0.551821 7.52586 0.551822 7.89438 1.28887L13.2763 12.0528C13.6088 12.7177 13.1253 13.5 12.3819 13.5H1.61799C0.874607 13.5 0.391112 12.7177 0.723562 12.0528ZM6.24995 5H7.74995V9H6.24995V5ZM6.99995 11.5C7.55224 11.5 7.99995 11.0523 7.99995 10.5C7.99995 9.94771 7.55224 9.5 6.99995 9.5C6.44767 9.5 5.99995 9.94771 5.99995 10.5C5.99995 11.0523 6.44767 11.5 6.99995 11.5Z"
        fill="#FF0C46"
      />
    </svg>
  ),
  pending: (
    <svg
      className="va-middle"
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 14.5C10.866 14.5 14 11.366 14 7.5C14 3.63401 10.866 0.5 7 0.5C3.13401 0.5 0 3.63401 0 7.5C0 11.366 3.13401 14.5 7 14.5ZM5.75 3V7.58579C5.75 8.04992 5.93437 8.49503 6.26256 8.82322L8.46967 11.0303L9.53033 9.96967L7.32322 7.76256C7.27634 7.71568 7.25 7.65209 7.25 7.58579V3H5.75Z"
        fill="#F6921D"
      />
    </svg>
  ),
  sent: (
    <svg
      className="va-middle"
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 1.5C4.1339 1.5 1 4.6339 1 8.5C1 12.3661 4.1339 15.5 8 15.5C11.8661 15.5 15 12.3661 15 8.5C15 4.6339 11.8654 1.5 8 1.5ZM7.475 12.525L3.975 9.9L5.025 8.5L7.125 10.075L10.8 5.175L12.2 6.225L7.475 12.525Z"
        fill="#20BF55"
      />
    </svg>
  )
}
const texts = {
  [PENDING]: "Missing attribution data for current user. Will retry when it arrives.",
  [BLOCKED]:
    "Tried to send request several times, but failed. Request won`t be sent.",
  [SKIPPED]: "Error occured. See details below."
}
const isErrorStatus = (status, common = false) => {
  const errorStatuses = [BLOCKED, SKIPPED, FAILED, undefined, null]

  if (common) errorStatuses.splice(1, 1)

  return errorStatuses.indexOf(status) > -1
}
const moment = require("moment-timezone")

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 8,
    width: 980
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}
const isSuccessStatusCode = (code) => {
  return (code > 99 && code < 103) || (code > 199 && code < 227)
}

class UserFeedItemsIntegrationsStatus extends Component {
  getLog = (integrationName) => {
    const { event, appId } = this.props
    const { id } = event

    this.setState({ logLoading: true })

    axios
      .get(
        `/apps/${appId}/integration_logs?event_id=${id}&service=${integrationName}`
      )
      .then((response) => {
        this.setState({
          logLoading: false,
          log: response.data.data.results
        })
      })
  };

  componentWillMount() {
    this.setState({ commonStatus: this.getCommonStatus() })
  }

  getCommonStatus = () => {
    const { integrationsSent } = this.props

    let errors = 0
    let pending = 0
    let sent = 0
    let skipped = 0

    for (const key of Object.keys(integrationsSent)) {
      if (this.getIntegrationInfo(key)) {
        if (isErrorStatus(this.getIntegrationInfo(key).status, true)) errors++
        if ([PENDING].indexOf(this.getIntegrationInfo(key).status) > -1) { pending++ }
        if ([SENT].indexOf(this.getIntegrationInfo(key).status) > -1) sent++
        if (this.getIntegrationInfo(key).status === SKIPPED) {
          skipped++
          sent++
        }
      }
    }

    if (errors > 0) return "error"
    if (pending > 0) return "pending"
    if (skipped === Object.keys(integrationsSent).length) return 'skipped'
    if (sent === Object.keys(integrationsSent).length && sent > 0) { return "sent" }

    return "disabled"
  };

  linkClasses = () => {
    const { commonStatus } = this.state

    return classNames("user-feed__item-bottom__info-item__integrations-link", {
      [`user-feed__item-bottom__info-item__integrations-link_${commonStatus}`]: true
    })
  };

  statusClasses = (status) => {
    return classNames("", {
      "text-green": status === SENT,
      "text-orange": status === "pending",
      "text-red": [BLOCKED, SKIPPED, FAILED].indexOf(status) > -1
    })
  };

  getIntegrationInfo = (key) => {
    const { integrationsSent } = this.props

    return integrationsSent[key] ? integrationsSent[key] : {}
  };

  popUpContent = () => {
    const { integrationsSent } = this.props

    return (
      <div className="custom-select__onhover-popup__menu custom-select__onhover-popup__menu-integrations__statuses">
        <div
          ref="menu"
          className="custom-select__outer custom-select__outer_relative"
        >
          <div className="custom-select__outer-menu container-content__integrations-table_nohover">
            <table className="table table_nopointer">
              <thead>
                <tr className="table100-head">
                  <th className="column-users__integraitons-statuses-1">
                    INTEGRATION
                  </th>
                  <th className="column-users__integraitons-statuses-2">
                    STATUS
                  </th>
                  <th className="column-users__integraitons-statuses-3"></th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(integrationsSent).map((key) => (
                  <tr key={key}>
                    <td
                      className="capitalize column-users__integraitons-statuses-1"
                      title={key}
                    >
                      <span className="column-users__integraitons-statuses__max-width">
                        {key}
                      </span>
                    </td>
                    <td className="column-users__integraitons-statuses-2">
                      {
                        ICONS[
                          isErrorStatus(this.getIntegrationInfo(key).status)
                            ? "error"
                            : this.getIntegrationInfo(key).status
                        ]
                      }
                      <span
                        className={this.statusClasses(
                          this.getIntegrationInfo(key).status
                        )}
                      >
                        {this.getIntegrationInfo(key).status === SENT ? (
                          <span className="va-middle user-feed__item-bottom__info-item__integration-status">
                            {this.getIntegrationInfo(key).sent_at && (
                              <span>
                                Sent on&nbsp;
                                <Moment
                                  className="uppercase"
                                  format="MMM DD, HH:mm"
                                  date={moment(
                                    this.getIntegrationInfo(key).sent_at,
                                    "YYYY-MM-DD HH:mm"
                                  )}
                                />{" "}
                                UTC
                                <br />
                                <span className="small-text">
                                  <Moment
                                    className="uppercase"
                                    format="MMM DD, HH:mm"
                                    date={this.getIntegrationInfo(key).sent_at}
                                  />{" "}
                                  {moment.tz(moment.tz.guess()).format("z")}
                                </span>
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="va-middle user-feed__item-bottom__info-item__integration-status capitalize">
                            {this.getIntegrationInfo(key).status}
                            {texts[this.getIntegrationInfo(key).status] && (
                              <Tip
                                description={
                                  texts[this.getIntegrationInfo(key).status]
                                }
                              />
                            )}
                          </span>
                        )}
                      </span>
                      {[BLOCKED, FAILED].indexOf(
                        this.getIntegrationInfo(key).status
                      ) > -1 && (
                        <div className="user-feed__item-bottom__info-item__integration-desc">
                          Number of attempts:{" "}
                          {this.getIntegrationInfo(key).tries_count} of 5
                        </div>
                      )}
                      {this.getIntegrationInfo(key).status === SKIPPED && (
                        <div className="user-feed__item-bottom__info-item__integration-desc">
                          {this.getIntegrationInfo(key).reason}
                        </div>
                      )}
                    </td>
                    <td className="column-users__integraitons-statuses-3">
                      {[SKIPPED, PENDING].indexOf(
                        this.getIntegrationInfo(key).status
                      ) === -1 && (
                        <div
                          className="link link_normal cp"
                          onClick={this.handleOpenIntegrationLogs.bind(
                            null,
                            key,
                            this.getIntegrationInfo(key)
                          )}
                        >
                          View details
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  };

  handleOpenIntegrationLogs = (integrationName, options) => {
    this.setState({
      currentIntegration: {
        integrationName,
        options
      }
    })
    this.getLog(integrationName)
  };

  handleCloseIntegrationsLogs = () => {
    this.setState({ currentIntegration: undefined, log: undefined })
  };

  render() {
    const { integrationsSent } = this.props
    const { commonStatus, currentIntegration, log, logLoading } = this.state

    return commonStatus !== DISABLED ? (
      <div>
        <Tooltip
          {...(currentIntegration ? { visible: true } : {})}
          ref="tooltip"
          mouseEnterDelay={0.1}
          placement="left"
          trigger={["click"]}
          overlay={this.popUpContent()}
          align={{ points: ["tr", "tl"], offset: [0, -29] }}
          onVisibleChange={(e) => {
            if (e) {
              track("events_integrations_hint_opened", this.props.event);
            }
          }}
        >
          <div className="user-feed__item-bottom__info-item cp">
            {ICONS[commonStatus]}
            <div className={this.linkClasses()}>
              Integrations: {commonStatus}
            </div>
          </div>
        </Tooltip>
        {currentIntegration && (
          <Modal
            isOpen={!!currentIntegration}
            onRequestClose={this.handleCloseIntegrationsLogs}
            ariaHideApp={false}
            style={customStyles}
            contentLabel={currentIntegration.integrationName}
            portalClassName="ReactModalPortal ReactModal__Content-top"
            className="ReactModal__Content ReactModal__Content-visible"
          >
            <svg
              style={{ zIndex: 1 }}
              onClick={this.handleCloseIntegrationsLogs}
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
            <div
              style={{ padding: "20px 30px" }}
              className="container-content__integrations-table_nohover user-feed__item-log__modal"
            >
              <div className="newapp-header__title">
                <span className="capitalize">
                  {currentIntegration.integrationName}&nbsp;
                </span>
                logs
              </div>
              {(logLoading || log.length > 0) && (
                <table className="table table_log table_nopointer mt20">
                  <thead>
                    <tr className="table100-head">
                      <th width="20%">
                        <span className="uppercase">Sent at</span>
                      </th>
                      <th width="15%" className="column2">
                        <span className="uppercase">HTTP STATUS</span>
                      </th>
                      <th width="32.5%" className="column2">
                        <span className="uppercase">REQUEST BODY</span>
                      </th>
                      <th width="32.5%" className="column2">
                        <span className="uppercase">RESPONSE BODY</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logLoading && (
                      <tr>
                        <td width="20%">
                          <div
                            className="animated-background timeline-item"
                            style={{
                              width: "100%",
                              height: 16,
                              marginRight: 10,
                              display: "inline-block",
                              marginTop: 5
                            }}
                          />
                        </td>
                        <td width="15%">
                          <div
                            className="animated-background timeline-item"
                            style={{
                              width: "100%",
                              height: 16,
                              marginRight: 10,
                              display: "inline-block",
                              marginTop: 5
                            }}
                          />
                        </td>
                        <td width="32.5%">
                          <div
                            className="animated-background timeline-item"
                            style={{
                              width: "100%",
                              height: 16,
                              marginRight: 10,
                              display: "inline-block",
                              marginTop: 5
                            }}
                          />
                        </td>
                        <td width="32.5%">
                          <div
                            className="animated-background timeline-item"
                            style={{
                              width: "100%",
                              height: 16,
                              marginRight: 10,
                              display: "inline-block",
                              marginTop: 5
                            }}
                          />
                        </td>
                      </tr>
                    )}
                    {log &&
                      log.map((logItem, index) => (
                        <tr key={index}>
                          <td width="20%">
                            <Moment
                              className="uppercase"
                              format="MMM DD, HH:mm:ss"
                              date={logItem.created_at}
                            />
                          </td>
                          <td
                            width="15%"
                            className={
                              isSuccessStatusCode(
                                parseFloat(logItem.response_status)
                              )
                                ? "text-green"
                                : "text-red"
                            }
                          >
                            {isSuccessStatusCode(
                              parseFloat(logItem.response_status)
                            )
                              ? ICONS.sent
                              : ICONS.error}
                            <span className="va-middle user-feed__item-bottom__info-item__logstatus">
                              {logItem.response_status}
                            </span>
                          </td>
                          <td width="32.5%">
                            <div className="user-feed__item-bottom__info-item__log-text">
                              <ExpandText
                                maxLength={70}
                                text={logItem.request_data}
                                expandText="Expand"
                                collapseText="Collapse"
                                pre
                              />
                            </div>
                          </td>
                          <td width="32.5%">
                            <div className="user-feed__item-bottom__info-item__log-text">
                              <ExpandText
                                maxLength={70}
                                text={logItem.response_body}
                                expandText="Expand"
                                collapseText="Collapse"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {!logLoading && log.length === 0 && (
                <div className="mt20">
                  Log was not found. Probably, because event is too old.
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    ) : (
      <div />
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserFeedItemsIntegrationsStatus)
