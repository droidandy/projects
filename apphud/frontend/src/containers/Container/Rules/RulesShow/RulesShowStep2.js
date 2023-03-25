import React, { Component } from "react"
import { connect } from "react-redux"
import history from "../../../../history"
import classNames from "classnames"
import Tip from "../../../Common/Tip"
import Filters from "../../../Common/Filters/Filters"
import InputRadio from "../../../Common/InputRadio"
import RuleNavigation from "../../../../components/Common/RuleNavigation"
import axios from "axios"
import { generateSegmentsForFrontend } from "../../../../libs/helpers"

import { fetchButlerRuleRequest } from "../../../../actions/butlerRule"

class RulesShowStep2 extends Component {
  state = {
    segments: [],
    dictionarySegments: [],
    allUsers: false,
    loading: true,
    submitted: false
  };

  handleChangeFilters = (segments) => {
    this.setState({ segments })
  };

  componentDidMount() {
    window.scrollTo(0, 0)
    this.getRule()
    window.updateRule = (cb, onError) => {
      this.setState({ submitted: true })

      if (this.valid()) {
        this.updateRule(cb, onError)
      } else onError()
    }
    window.hasUnsavedChanges = this.hasUnsavedChanges
  }

  removeFields = (params) => {
    delete params.loading
    delete params.saving
    delete params.dictionarySegments
    // delete params.allUsers
  };

  hasUnsavedChanges = () => {
    const state = JSON.parse(JSON.stringify(this.state))
    this.removeFields(state)
    this.removeFields(this.beginState)

    return JSON.stringify(this.beginState) !== JSON.stringify(state)
  };

  generateSegmentsForBackend = (segments) => {
    const result = []
    const { allUsers } = this.state

    segments = segments.filter((segment) => segment)

    for (const segment of segments) {
      const newSegment = {
        properties: {}
      }

      if (segment.productGroup) {
        newSegment.properties[segment.value] = {
          [segment.productGroup]: segment.equal
        }
      } else newSegment.properties[segment.value] = segment.equal

      if (segment.hasOwnProperty("id")) {
        newSegment.id = segment.id

        if (segment.hasOwnProperty("destroy")) { newSegment.destroy = segment.destroy }
      }

      if (allUsers) newSegment.destroy = true

      result.push(newSegment)
    }

    return result
  };

  updateRule = (cb, onError = () => {}) => {
    const { ruleId } = this.props.match.params
    this.setState({ saving: true })
    const params = JSON.parse(JSON.stringify(this.state))

    if (params.segments.length > 0) { params.segments = this.generateSegmentsForBackend(params.segments) }

    this.removeFields(params)
    axios
      .put(`/butler/rules/${ruleId}`, params)
      .then(() => {
        cb()
        this.setState({ saving: false })
      })
      .catch(() => {
        onError()
        this.setState({ saving: false })
      })
  };

  getRule = (rule, cb = () => {}) => {
    const { ruleId } = this.props.match.params

    this.props.fetchButlerRuleRequest(ruleId, ({ results, meta }) => {
      setTimeout(() => {
        this.setState({ loading: false })
      }, 500)

      for (const segment of meta.segments) {
        segment.items = segment.options
        delete segment.options
      }

      results.segments = generateSegmentsForFrontend(
        results.segments,
        meta.segments
      )

      this.setState(
        {
          ...results,
          dictionarySegments: meta.segments,
          allUsers: results.segments.length === 0
        },
        () => {
          this.beginState = JSON.parse(JSON.stringify(this.state))
        }
      )
    })
  };

  handleChangeAllUsers = ({ target }) => {
    this.setState({ allUsers: JSON.parse(target.value) })
  };

  handleNext = () => {
    const { appId, rulesType, ruleId } = this.props.match.params
    this.setState({ submitted: true })

    if (this.valid()) {
      this.updateRule(() => {
        history.push(
          `/apps/${appId}/newrules/${rulesType}/${ruleId}/configure/3`
        )
      })
    }
  };

  handleBack = () => {
    const { appId, rulesType, ruleId } = this.props.match.params
    history.push(`/apps/${appId}/newrules/${rulesType}/${ruleId}/configure/1`)
  };

  valid = () => {
    const { allUsers, segments } = this.state

    return (
      (!allUsers && segments.filter((s) => !s.destroy).length > 0) || allUsers
    )
  };

  segmentsInvalid = () => {
    const { submitted, allUsers, segments } = this.state

    return (
      submitted && !allUsers && segments.filter((s) => !s.destroy).length === 0
    )
  };

  render() {
    const {
      segments,
      dictionarySegments,
      saving,
      allUsers,
      loading
    } = this.state

    return (
      <div>
        {loading ? (
          <div>
            <div
              className="animated-background timeline-item"
              style={{ width: 350, marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 350, marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 350, marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 350, marginTop: 20 }}
            />
            <div
              className="animated-background timeline-item"
              style={{ width: 350, marginTop: 20 }}
            />
          </div>
        ) : (
          <div>
            <div className="container-content__integrations-settings__content-title rules-section__subtitle">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="6" cy="5.5" r="3" fill="#97ADC6" />
                <path
                  d="M11 14C11 12.6739 10.4732 11.4021 9.53553 10.4645C8.59785 9.52678 7.32608 9 6 9C4.67392 9 3.40215 9.52678 2.46447 10.4645C1.52678 11.4021 1 12.6739 1 14L6 14H11Z"
                  fill="#97ADC6"
                />
                <circle cx="11.5" cy="6" r="1.5" fill="#97ADC6" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.0793 11C11.8316 10.4326 11.4784 9.9107 11.0322 9.46447C10.6586 9.09087 10.232 8.7825 9.77002 8.54669C10.2721 8.19332 10.8744 8 11.4967 8C12.2923 8 13.0554 8.31607 13.618 8.87868C14.1806 9.44129 14.4967 10.2044 14.4967 11H12.0793Z"
                  fill="#97ADC6"
                />
              </svg>
              <span>For whom rule will be performed?</span>
              <Tip
                title="For whom rule will be performed?"
                description="Build a segment of a users who will receive the rule"
              />
            </div>
            <div className="input-wrapper">
              <InputRadio
                checked={allUsers}
                label="For all users"
                value={true}
                onChange={this.handleChangeAllUsers}
                useTip={false}
              />
              <InputRadio
                checked={allUsers === false}
                label="For custom segments of users"
                value={false}
                onChange={this.handleChangeAllUsers}
                useTip={false}
              />
            </div>
            {this.segmentsInvalid() && (
              <div className="input-wrapper text-red">
                Add at least one segment
              </div>
            )}
            <div className={allUsers ? "disabled-with-opacity" : ""}>
              <Filters
                separator="AND"
                modalTitle="Add user segment"
                filterTitle="User property"
                addButtonTitle="Segment"
                destroyable={true}
                filters={segments}
                dictionaryFilters={dictionarySegments}
                handleChangeFilters={this.handleChangeFilters}
              />
            </div>
          </div>
        )}
        <RuleNavigation
          handleBack={this.handleBack}
          handleNext={this.handleNext}
          saving={saving}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions
  }
}

const mapDispatchToProps = {
  fetchButlerRuleRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesShowStep2)
