import React, { Component } from "react"
import { connect } from "react-redux"
import {
  updateApplicationRequest,
  fetchApplicationRequest
} from "../../../../actions/application"
import PaywallConfigList from "../../../../components/ProductStructure/PaywallConfigList";

class PaywallConfigs extends Component {
  componentDidMount() {
    document.title = "Apphud | Paywalls"
  }

  render() {
    return (
      <div className="container-content__blue-content">
        <PaywallConfigList
            appId={this.props.match.params.appId}
            createAction={this.state?.createAction}
            createActionCallback={(val = false) => this.setState({ createAction: val })}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application
  }
}

const mapDispatchToProps = {
  updateApplicationRequest,
  fetchApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(PaywallConfigs)
