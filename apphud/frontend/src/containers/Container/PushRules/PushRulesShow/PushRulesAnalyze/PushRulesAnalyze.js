import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import axios from "axios"
import Aux from "../../../../../hoc/Aux"
import Moment from "react-moment"
import NumberFormat from "react-number-format"

import CustomSelect from "../../../../Common/CustomSelect"
import Tip from "../../../../Common/Tip"
import AnalyzeBar from "../../../../Common/AnalyzeBar"

import { fetchRuleRequest } from "../../../../../actions/rule"

class PushRulesAnalyze extends Component {
  state = {
    loading: true,
    rule: {},
    data: {
      options: [{}]
    },
    currentOption: {},
    currentOptionData: {
      meta: {
        results: []
      }
    }
  };

  getDashboardData = (onSuccess = () => {}, onError = () => {}) => {
    axios
      .get(`/rules/${this.props.match.params.ruleId}/dashboard`)
      .then((response) => {
        const data = response.data.data.results
        onSuccess(data)
      })
  };

  getOptionData = (optionId, onSuccess) => {
    axios
      .get(
        `/rules/${this.props.match.params.ruleId}/options/${optionId}/events`
      )
      .then((response) => {
        const data = response.data.data
        onSuccess(data)
      })
  };

  componentDidMount() {
    document.title = "Apphud | Rule analyze"
    this.props.fetchRuleRequest(this.props.match.params.ruleId, (rule) => {
      this.getDashboardData((data) => {
        this.setState({
          data,
          rule,
          loading: false
        })
        this.handleChangeOption(data.options[0] ? data.options[0] : {})
      })
    })
  }

  handleChangeOption = (currentOption) => {
    if (currentOption.id) {
      this.setState({ currentOption, optionDataLoading: true })
      this.getOptionData(currentOption.id, (data) => {
        this.setState({
          currentOptionData: data,
          optionDataLoading: false
        })
      })
    }
  };

  render() {
    const {
      rule,
      currentOption,
      data,
      loading,
      optionDataLoading,
      currentOptionData
    } = this.state

    return (
      <div className="container-content container-content__white container-content__integrations">
        <div className="container-content__integrations-settings__content-title">
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
              d="M5 3H3V13H5V3ZM7 5H9V11H7V5ZM11 6H13V10H11V6Z"
              fill="#97ADC6"
            />
          </svg>
          <span>Rule funnel</span>
        </div>
        {loading ? (
          <div>
            <div className="animated-background timeline-item" />
            <div className="animated-background timeline-item__row" />
            <div className="animated-background timeline-item__row" />
            <div className="animated-background timeline-item__row" />
            <p>&nbsp;</p>
          </div>
        ) : (
          <Aux>
            {["subscription_canceled", "trial_canceled"].indexOf(
              rule.rule_condition
            ) > -1 && (
              <div>
                <div className="pushrules-analyze__row">
                  <div className="pushrules-analyze__col_4_of_12">
                    <div className="pushrules-analyze__box">
                      <span className="pushrules-analyze__box-title">
                        Rule triggered
                      </span>
                      <Tip
                        title="Rule triggered"
                        description="The number of times rule was executed."
                      />
                      <div className="pushrules-analyze__box-value">
                        <NumberFormat
                          value={data.rule_triggered}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </div>
                    </div>
                    <svg
                      className="pushrules__arrow-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20.7071 10.2929L13.7071 3.29291L12.2929 4.70712L17.5857 9.99997H3V12H17.5858L11.7929 17.7929L13.2071 19.2071L20.7071 11.7071L21.4142 11L20.7071 10.2929Z"
                        fill="#1A344B"
                      />
                    </svg>
                  </div>
                  <div className="pushrules-analyze__col_4_of_12">
                    <div className="pushrules-analyze__box">
                      <span className="pushrules-analyze__box-title">
                        Survey presented
                      </span>
                      <Tip
                        title="Survey presented"
                        description="The number of times a survey was shown to users."
                      />
                      <div className="pushrules-analyze__box-value">
                        <NumberFormat
                          value={data.enquiry_presented}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container-content__integrations-settings__content-title pushrules-analyze__title-2">
                  <span>{rule.question}</span>
                </div>
                <div className="pushrules-analyze__subtitle">
                  <NumberFormat
                    value={data.option_selected}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                  &nbsp;of&nbsp;
                  <NumberFormat
                    value={data.enquiry_presented}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                  &nbsp;users answered this question
                </div>
                <div className="pushrules-analyze__chart">
                  {data.options.map((option) => (
                    <AnalyzeBar
                      key={option.id}
                      percent={option.share_in_rule * 100}
                      count={option.events_count}
                      title={option.title}
                      trackColor="#20BF55"
                    />
                  ))}
                </div>
                <div className="c-c__b-c__box-header c-c__b-c__box-header_select pushrules-analyze__select">
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
                      d="M3 1C1.34315 1 0 2.34315 0 4V9C0 10.6569 1.34315 12 3 12H4V16L9 12H13C14.6569 12 16 10.6569 16 9V4C16 2.34315 14.6569 1 13 1H3Z"
                      fill="#97ADC6"
                    />
                  </svg>
                  <span className="c-c__b-c__box-header-title c-c__b-c__box-header-title-3">
                    <CustomSelect
                      value={currentOption}
                      onChange={this.handleChangeOption}
                      labelKey="title"
                      valueKey="id"
                      options={data.options}
                    />
                  </span>
                </div>
                {optionDataLoading && (
                  <div>
                    <p>&nbsp;</p>
                    <div className="animated-background timeline-item" />
                    <div className="animated-background timeline-item__row" />
                    <div className="animated-background timeline-item__row" />
                    <p>&nbsp;</p>
                  </div>
                )}
                {!optionDataLoading &&
                  currentOptionData.meta.option_action ===
                    "present_feedback_screen" && (
                  <div>
                    <div className="container-content__integrations-settings__content-title pushrules-analyze__title">
                      <span>{currentOption.feedback_question}</span>
                    </div>
                    <div className="pushrules-analyze__table container-content__integrations-table_nohover">
                      <table className="table">
                        <thead>
                          <tr>
                            <th width="15%" className="column1_pushrules">
                              <span className="uppercase">USER ID</span>
                            </th>
                            <th width="15%" className="column2">
                              <span className="uppercase">DATE</span>
                            </th>
                            <th width="70%" className="column4">
                              <span className="uppercase">FEEDBACK</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOptionData.results.map((item, index) => (
                            <tr key={index}>
                              <td width="15%">
                                <div className="va-middle column1_rules-name">
                                  {item.customer_id}
                                </div>
                              </td>
                              <td width="15%">
                                <div className="va-middle column1_rules-name">
                                  <Moment
                                    format="MMM DD, Y"
                                    date={item.created_at}
                                  />
                                </div>
                              </td>
                              <td width="70%">
                                <div className="va-middle column1_rules-name">
                                  {item.feedback_text}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {!optionDataLoading &&
                  currentOptionData.meta.option_action ===
                    "present_purchase_screen" && (
                  <div className="pushrules-analyze__row pushrules-analyze__row_mt">
                    <div className="pushrules-analyze__col_4_of_12">
                      <div className="pushrules-analyze__box">
                        <span className="pushrules-analyze__box-title">
                            Offer presented
                        </span>
                        <Tip
                          title="Offer presented"
                          description="The number of times purchase screen was presented to users."
                        />
                        <div className="pushrules-analyze__box-value">
                          <NumberFormat
                            value={currentOptionData.results.offer_presented}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </div>
                      </div>
                      <svg
                        className="pushrules__arrow-icon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.7071 10.2929L13.7071 3.29291L12.2929 4.70712L17.5857 9.99997H3V12H17.5858L11.7929 17.7929L13.2071 19.2071L20.7071 11.7071L21.4142 11L20.7071 10.2929Z"
                          fill="#1A344B"
                        />
                      </svg>
                    </div>
                    <div className="pushrules-analyze__col_4_of_12">
                      <div className="pushrules-analyze__box">
                        <span className="pushrules-analyze__box-title">
                            Offer activated
                        </span>
                        <Tip
                          title="Offer activated"
                          description="The number of activated promotional offers."
                        />
                        <div className="pushrules-analyze__box-value">
                          <NumberFormat
                            value={currentOptionData.results.offer_activated}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {rule.rule_condition === "billing_issue" && (
              <div>
                <div className="pushrules-analyze__row">
                  <div className="pushrules-analyze__col_4_of_12">
                    <div className="pushrules-analyze__box">
                      <span className="pushrules-analyze__box-title">
                        Rule triggered
                      </span>
                      <Tip
                        title="Rule triggered"
                        description="The number of billing issues occured."
                      />
                      <div className="pushrules-analyze__box-value">
                        {data.rule_triggered}
                      </div>
                    </div>
                    <svg
                      className="pushrules__arrow-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20.7071 10.2929L13.7071 3.29291L12.2929 4.70712L17.5857 9.99997H3V12H17.5858L11.7929 17.7929L13.2071 19.2071L20.7071 11.7071L21.4142 11L20.7071 10.2929Z"
                        fill="#1A344B"
                      />
                    </svg>
                  </div>
                  <div className="pushrules-analyze__col_4_of_12 pushrules-analyze__col_255">
                    <div className="pushrules-analyze__box">
                      <span className="pushrules-analyze__box-title">
                        Billing issue screen presented
                      </span>
                      <Tip
                        title="Billing issue screen presented"
                        description="The number of times “Update payment details” screen was presented to users."
                      />
                      <div className="pushrules-analyze__box-value">
                        {data.enquiry_presented}
                      </div>
                    </div>
                    <svg
                      className="pushrules__arrow-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20.7071 10.2929L13.7071 3.29291L12.2929 4.70712L17.5857 9.99997H3V12H17.5858L11.7929 17.7929L13.2071 19.2071L20.7071 11.7071L21.4142 11L20.7071 10.2929Z"
                        fill="#1A344B"
                      />
                    </svg>
                  </div>
                  <div className="pushrules-analyze__col_4_of_12 pushrules-analyze__col_255">
                    <div className="pushrules-analyze__box">
                      <span className="pushrules-analyze__box-title">
                        Update payment tapped
                      </span>
                      <Tip
                        title="Update payment tapped"
                        description="The number of times users tapped “Update payment details” button."
                      />
                      <div className="pushrules-analyze__box-value">
                        {data.update_payment_tapped}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Aux>
        )}
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
  fetchRuleRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(PushRulesAnalyze)
