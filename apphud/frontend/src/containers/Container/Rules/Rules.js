import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import SweetAlert from "react-swal"
import axios from "axios"
import titleize from "titleize"
import history from "../../../history"
import { NotificationManager } from "../../../libs/Notifications"
import CustomSelect from "../../Common/CustomSelect"
import ResultModal from "../../Common/ResultModal"
import RulesConfirmsModal from "./RulesConfirmsModal"
import RulesTestModal from "./RulesTestModal"
import Modal from "react-modal"

import imageWaiting from "../../../assets/images/rules-empty.jpg"
import imageWaiting2 from "../../../assets/images/pushrules.jpg"

import RulesItem from "./RulesItem"
import { fetchButlerRulesRequest } from "../../../actions/butlerRules"
import {track} from "../../../libs/helpers";

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

const rulesTypes = [
  { label: "All rules", value: "all" },
  { label: "Manual", value: "manual" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Automated", value: "automated" },
  { label: "Archived", value: "archived" }
]

class Rules extends Component {
  state = {
    loading: true,
    rules: [],
    showAuthKeyPopup: false,
    resultModal: {
      title: "",
      description: "",
      open: false
    },
    confirmModal: {
      title: "",
      description: "",
      onConfirm: () => {},
      confirmButtonText: "",
      open: false
    },
    testModal: {
      show: false,
      ruleId: ""
    }
  };

  componentDidMount() {
    document.title = "Apphud | Rules"
    this.setState({ loading: true }, this.getRules)
  }

  getRules = () => {
    this.props.fetchButlerRulesRequest(
      { appId: this.props.match.params.appId },
      (rules) => {
        this.setState({
          rules,
          loading: false
        })
      }
    )
  };

  updateRule = (rule, cb = () => {}) => {
    axios.put(`/butler/rules/${rule.id}`, rule).then(cb)
  };

  handleChangeRule = (ruleId, props) => {
    this.setState((state) => {
      const rules = state.rules
      Object.assign(
        rules.find((rule) => rule.id === ruleId),
        props
      )

      return { rules }
    })
  };

  addRule = (e) => {
    e.preventDefault()
    history.push(
      `/apps/${this.props.match.params.appId}/newrules/all/new/configure/select-template`
    )
  };

  handleCloseAuthKeyPopup = () => {
    this.setState({ showAuthKeyPopup: false })
  };

  handleChangeRulesType = (item) => {
    const { appId } = this.props.match.params

    history.push(`/apps/${appId}/newrules/${item.value}`)
  };

  showResultModal = ({ title, description }) => {
    this.setState({ resultModal: { title, description, show: true } })
  };

  closeResultModal = () => {
    this.setState({ resultModal: { title: "", description: "", show: false } })
  };

  showConfirmModal = ({
    type,
    title,
    description,
    confirmButtonText,
    onConfirm
  }) => {
    this.setState({
      confirmModal: {
        type,
        title,
        description,
        confirmButtonText,
        onConfirm,
        show: true
      }
    })
  };

  closeConfirmModal = () => {
    this.setState({
      confirmModal: {
        type: "",
        title: "",
        description: "",
        confirmButtonText: "",
        onConfirm: () => {},
        show: false
      }
    })
  };

  closeTestModal = () => {
    this.setState({ testModal: { show: false, ruleId: {} } })
  };

  showTestModal = (ruleId) => {
    this.setState({ testModal: { show: true, ruleId } })
  };

  getStatus = (rule) => {
    const { state, status } = rule

    if (["disabled", "archived"].indexOf(state) > -1) return state
    else return status
  };

  filterRules = (rules) => {
    const { rulesType } = this.props.match.params

    if (rulesType.indexOf("all") > -1) { return rules.filter((rule) => this.getStatus(rule) !== "archived") } else if (rulesType === "archived") { return rules.filter((rule) => this.getStatus(rule) === "archived") } else {
      return rules.filter(
        (rule) => rule.kind === rulesType && this.getStatus(rule) !== "archived"
      )
    }
  };

  onTestSuccess = () => {
    this.closeTestModal()
    this.showResultModal({ title: "Test rule triggered" })
  };

  onTestFail = () => {};

  getRulesType = () => {
    const { rulesType } = this.props.match.params
    const currentRulesType = rulesTypes.find(
      (item) => this.props.match.params.rulesType.indexOf(item.value) > -1
    )

    if (currentRulesType) return currentRulesType
    else return {}
  };

  render() {
    const { loading, resultModal, confirmModal, testModal, rules } = this.state
    const { appId, rulesType } = this.props.match.params

    return (
      <div className="container-content container-content__white container-content_pb150">
        <div className="container-top">
          <div className="fl">
            <div className="container-title container-title_withdescription">
              <CustomSelect
                value={this.getRulesType()}
                onChange={this.handleChangeRulesType}
                labelKey="label"
                valueKey="value"
                options={rulesTypes}
              />
            </div>
            <div className="container-description">
              Automatically reduce churn, increase revenue, build promo offers
              and much more.&nbsp;
              <a
                onClick={() => track("rules_learn_more_link_clicked")}
                className="link link_normal"
                href="https://docs.apphud.com/rules-and-screens/rules"
                target="blank"
              >
                Learn more
              </a>
              <div className="container-tutorial__link">
                <a
                  className="container-tutorial__link-item"
                  href={`/apps/${appId}/newrules/all?product_tour_id=94178`}
                >
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.58579 2.5H1.5C1.22386 2.5 1 2.72386 1 3V10C1 10.2761 1.22386 10.5 1.5 10.5H4.58579C4.851 10.5 5.10536 10.6054 5.29289 10.7929L6 11.5L6.70711 10.7929C6.89464 10.6054 7.149 10.5 7.41421 10.5H10.5C10.7761 10.5 11 10.2761 11 10V3C11 2.72386 10.7761 2.5 10.5 2.5H7.41421C7.149 2.5 6.89464 2.60536 6.70711 2.79289L6 3.5L5.29289 2.79289C5.10536 2.60536 4.851 2.5 4.58579 2.5ZM3 5H5V5.5H3V5ZM9 5H7V5.5H9V5ZM7 6.5H10V7H7V6.5ZM10 8H7V8.5H10V8ZM2 8H5V8.5H2V8ZM5 6.5H2V7H5V6.5Z"
                      fill="#F6921D"
                    />
                  </svg>
                  <span>View interactive tutorial</span>
                </a>
              </div>
            </div>
          </div>
          <button
            disabled={loading}
            className="fr button button_green button_160"
            onClick={this.addRule}
          >
            <span>Create rule</span>
          </button>
          <div className="clear" />
        </div>
        <div className="container-table">
          {!loading && this.filterRules(rules).length === 0 && (
            <div className="ta-center empty-label">
              <img
                src={imageWaiting}
                className="empty-label__image"
                alt="No rules"
                width="540px"
                height="350px"
              />
              <div className="empty-label__title">No rules created</div>
              <div className="empty-label__description">
                <button
                  className="button button_green button_255"
                  onClick={this.addRule}
                >
                  Create rule
                </button>
              </div>
            </div>
          )}
          {(loading || this.filterRules(rules).length > 0) && (
            <div className="container-table container-content__integrations-table container-content__rules-table container-content__integrations-table_nohover">
              <table className="table">
                <thead>
                  <tr className="table100-head">
                    <th className="rules-table__column1"></th>
                    <th
                      className="rules-table__column2"
                      style={{ width: "45%" }}
                    >
                      <span className="uppercase">NAME</span>
                    </th>
                    <th className={"container-table__clickable"}>
                      <span className="uppercase">TIMES PERFORMED</span>
                      {/* <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 7L8 3L12 7H4Z" fill="#97ADC6"/>
                        <path d="M4 9L8 13L12 9H4Z" fill="#97ADC6"/>
                      </svg> */}
                    </th>
                    <th className={"container-table__clickable"}>
                      <span className="uppercase">ADDED</span>
                      {/* <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 7L8 3L12 7H4Z" fill="#97ADC6"/>
                        <path d="M4 9L8 13L12 9H4Z" fill="#97ADC6"/>
                      </svg> */}
                    </th>
                    <th className="rules-table__column-last"></th>
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
                      <td>
                        <div className="animated-background timeline-item" />
                      </td>
                      <td>
                        <div className="animated-background timeline-item" />
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    this.filterRules(rules).map((rule, index) => (
                      <RulesItem
                        showResultModal={this.showResultModal}
                        showConfirmModal={this.showConfirmModal}
                        closeConfirmModal={this.closeConfirmModal}
                        showTestModal={this.showTestModal}
                        handleChangeRule={this.handleChangeRule}
                        updateRule={this.updateRule}
                        close={this.closeConfirmModal}
                        getRules={this.getRules}
                        getStatus={this.getStatus}
                        key={rule.id}
                        appId={appId}
                        rulesType={rulesType}
                        id={rule.id}
                        kind={rule.kind}
                        triggers_count={rule.triggers_count}
                        upcoming_date={rule.upcoming_date}
                        customers_affected={rule.customers_affected}
                        triggered_at={rule.triggered_at}
                        created_at={rule.created_at}
                        status={rule.status}
                        state={rule.state}
                        perform_at={rule.perform_at}
                        name={rule.name}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          )}
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
          {resultModal.show && (
            <ResultModal
              title={resultModal.title}
              description={resultModal.description}
              close={this.closeResultModal}
              onConfirm={this.closeResultModal}
            />
          )}
          {confirmModal.show && (
            <RulesConfirmsModal
              type={confirmModal.type}
              title={confirmModal.title}
              description={confirmModal.description}
              confirmButtonText={confirmModal.confirmButtonText}
              onConfirm={confirmModal.onConfirm}
              onCancel={() => {}}
              cancelButtonText="Cancel"
              close={this.closeConfirmModal}
            />
          )}
          {testModal.show && (
            <RulesTestModal
              appId={appId}
              ruleId={testModal.ruleId}
              close={this.closeTestModal}
              onTestSuccess={this.onTestSuccess}
              onTestFail={this.onTestFail}
            />
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
  fetchButlerRulesRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Rules)
