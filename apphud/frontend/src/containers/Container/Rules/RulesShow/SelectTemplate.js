import React, { Component } from "react"
import { connect } from "react-redux"
import history from "../../../../history"
import axios from "axios"
import RulesTemplate from "./RulesTemplate"

import icon6 from "../../../../assets/images/icon-app_blank_rule-64.jpg"

class RulesShowStep1 extends Component {
  state = {
    templates: []
  };

  request = (type, url, app = true, cb) => {
    const { user, match } = this.props
    const { appId } = match.params
    const resultUrl = `/apps/${appId}${url}`

    axios[type](app ? resultUrl : url).then((result) =>
      cb(result.data.data.results)
    )
  };

  getTemplates = () => {
    this.request("get", "/butler/templates", false, (templates) => {
      this.setState({ templates })
    })
  };

  goToRule = (id) => {
    const { rulesType, appId } = this.props.match.params
    history.push(`/apps/${appId}/newrules/${rulesType}/${id}/configure/1`)
  };

  createEmptyRule = () => {
    this.setState({ loading: true })
    this.request("post", "/butler/rules?kind=automated", true, (newRule) => {
      this.goToRule(newRule.id)
      this.setState({ loading: false })
    })
  };

  createFromTemplate = (id) => {
    const { appId } = this.props.match.params
    this.setState({ [`loading_${id}`]: true })
    this.request(
      "post",
      `/butler/rules/${id}/copy?app_id=${appId}`,
      false,
      (newRule) => {
        this.goToRule(newRule.id)
        this.setState({ [`loading_${id}`]: false })
      }
    )
  };

  componentDidMount() {
    this.getTemplates()
  }

  render() {
    const { templates, loading } = this.state
    return (
      <div>
        <div className="ta-center">
          <div className="rules-attention">
            Attention: you will not be able to change template once rule is
            created
          </div>
        </div>
        <div className="rules-templates">
          {templates.map((template, index) => (
            <RulesTemplate
              key={index}
              icon={template.icon && template.icon.url}
              title={template.name}
              description={template.description}
              tutorialUrl={template.tutorial_url}
              buttonText="Select template"
              buttonAction={this.createFromTemplate.bind(null, template.id)}
              loading={this.state["loading_" + template.id]}
            />
          ))}
          <RulesTemplate
            icon={icon6}
            title="Blank rule"
            description="Start from scratch and configure rule by yourself"
            tipTitle=""
            tipDescription=""
            tipButtonUrl=""
            buttonText="Create a rule"
            buttonAction={this.createEmptyRule}
            loading={loading}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(RulesShowStep1)
