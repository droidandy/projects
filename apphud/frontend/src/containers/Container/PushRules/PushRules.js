import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import SweetAlert from "react-swal"
import axios from "axios"
import titleize from "titleize"
import history from "../../../history"
import { NotificationManager } from "../../../libs/Notifications"
import Modal from "react-modal"

import imageWaiting from "../../../assets/images/dashboard-empty.jpg"
import imageWaiting2 from "../../../assets/images/pushrules.jpg"

import PushRulesItem from "./PushRulesItem"

import { fetchRulesRequest } from "../../../actions/rules"

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
    width: 410
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

class PushRules extends Component {
  state = {
    alertOpen: false,
    loading: true,
    rules: [],
    conditions: [],
    showAuthKeyPopup: false
  };

  getFillData = (cb = () => {}) => {
    axios
      .get(`/apps/${this.props.match.params.appId}/rules/new`)
      .then((response) => {
        const data = response.data.data.results
        cb(data)
      })
  };

  componentDidMount() {
    document.title = "Apphud | Rules"
    this.setState({ loading: true }, this.getRules)
  }

  getRules = () => {
    this.getFillData((data) => {
      const { conditions } = data
      this.setState({ conditions })
      this.props.fetchRulesRequest(
        { appId: this.props.match.params.appId },
        (rules) => {
          this.setState({
            rules,
            loading: false
          })
        }
      )
    })
  };

  handleChangeActive = (rule, e) => {
    var rules = this.state.rules.slice(0)
    var findedRule = rules.find((ruleItem) => ruleItem.id === rule.id)
    if (findedRule) {
      this.updateRule(
        { id: findedRule.id, active: e.target.checked },
        (response) => {
          this.getRules()
        }
      )
    }
  };

  updateRule = (rule, cb = () => {}) => {
    axios.put(`/rules/${rule.id}`, rule).then(cb)
  };

  remove = (rule) => {
    this.setState({
      alertOpen: true
    })
    this.ruleForRemove = rule
  };

  handleCallbackAlert = (value) => {
    this.setState({ alertOpen: false })

    if (value) {
      axios.delete(`/rules/${this.ruleForRemove.id}`).then((response) => {
        this.getRules()
      })
    }
  };

  addRule = (e) => {
    e.preventDefault()
    let { conditions, rules } = this.state

    if (rules.length > 0) {
      for (const rule of rules) {
        conditions = conditions.filter(
          (condition) => condition.name !== rule.rule_condition
        )
      }
    }

    if (!this.props.application.apns_auth_key) {
      this.setState({ showAuthKeyPopup: true })
    } else if (conditions.length > 0) { history.push(`/apps/${this.props.match.params.appId}/rules/new/config`) } else {
      NotificationManager.error(
        "You can only have one rule for each condition type",
        "Error",
        5000
      )
    }
  };

  handleCloseAuthKeyPopup = () => {
    this.setState({ showAuthKeyPopup: false })
  };

  render() {
    const { loading, rules } = this.state

    return (
      <div className="container-content container-content__white">
        <div className="container-top">
          <div className="fl">
            <div className="container-title container-title_withdescription">
              Rules
            </div>
            <div className="container-description">
              Winback lapsed customers and understand why users cancel
              subscriptions.&nbsp;
            </div>
          </div>
          {/* <button disabled={loading} className="fr button button_green button_icon button_160" onClick={this.addRule}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM9 7H12V9H9V12H7V9H4V7H7V4H9V7Z" fill="white"/>
            </svg>
            <span>Add a rule</span>
          </button> */}
          <div className="clear" />
        </div>
        <div className="container-table">
          {/* <div className="ta-center empty-label">
            <img src={imageWaiting2} className="empty-label__image" alt="No rules" width="540px" />
            <div className="empty-label__title">Configure Push notifications first</div>
            <div className="empty-label__description">Add APNS-certificate and configure Apple Subscriptions Notifications</div>
            <div className="empty-label__button">
              <a href="#" target="_blank" className="button button_blue button_inline button_160">Open settings</a>
            </div>
            <a className="empty-label__link" href="https://icons8.com/" target="_blank">Illustration by Icons8</a>
          </div> */}
          <Modal
            isOpen={this.state.showAuthKeyPopup}
            onRequestClose={this.handleCloseAuthKeyPopup}
            ariaHideApp={false}
            style={customStyles}
            contentLabel="Upload Auth Key"
          >
            <div style={{ padding: "20px 30px" }}>
              <div className="newapp-header__title">Upload Auth Key</div>
              <div className="input-wrapper">
                Please upload Auth Key for push notifications.
              </div>
              <div className="input-wrapper">
                <button
                  className="button button_blue popup-button fl"
                  onClick={this.handleCloseAuthKeyPopup}
                >
                  <span>Cancel</span>
                </button>
                <NavLink
                  to={`/apps/${this.props.match.params.appId}/settings/push`}
                  className="button button_green popup-button fr"
                >
                  <span>Open App Settings</span>
                </NavLink>
              </div>
            </div>
          </Modal>
          <SweetAlert
            isOpen={this.state.alertOpen}
            type="warning"
            title={"Confirm removal"}
            text="Do you really want to remove this integration? This can not be undone"
            confirmButtonText="Remove"
            cancelButtonText="Cancel"
            callback={this.handleCallbackAlert}
          />
          {!loading && rules.length === 0 && (
            <div className="ta-center empty-label">
              <img
                src={imageWaiting}
                className="empty-label__image"
                alt="No rules"
                width="540px"
                height="350px"
              />
              <div className="empty-label__title">
                There is currently no rules
              </div>
              <div className="empty-label__description">
                Click “Add a rule” button to add your first rule
              </div>
              <a
                className="empty-label__link"
                href="https://icons8.com/"
                target="_blank"
              >
                Illustration by Icons8
              </a>
            </div>
          )}
          {(loading || rules.length > 0) && (
            <div className="container-table container-content__integrations-table container-content__integrations-table_nohover">
              <table className="table">
                <thead>
                  <tr className="table100-head">
                    <th className="column1_integrations">
                      <span className="uppercase">TITLE</span>
                    </th>
                    <th className="column2">
                      <span className="uppercase">CONDITION</span>
                    </th>
                    <th className="column4">
                      <span className="uppercase">ENABLED</span>
                    </th>
                    <th className="column4">
                      <span className="uppercase">ADDED</span>
                    </th>
                    <th className="column5">
                      <span className="uppercase">ACTIONS</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td>
                        <div className="animated-background timeline-item" />
                      </td>
                      <td>
                        <div className="animated-background timeline-item" />
                      </td>
                      <td>
                        <div className="animated-background timeline-item" />
                      </td>
                      <td>
                        <div className="animated-background timeline-item" />
                      </td>
                      <td>
                        <div className="animated-background timeline-item" />
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    rules.map((rule) => (
                      <PushRulesItem
                        remove={this.remove}
                        key={rule.id}
                        appId={this.props.match.params.appId}
                        ruleActive={rule.active}
                        rule={rule}
                        handleChangeActive={this.handleChangeActive}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    application: state.application
  }
}

const mapDispatchToProps = {
  fetchRulesRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(PushRules)
