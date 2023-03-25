import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import history from "../../../history"
import Team from "../../Container/AppSettings/Team/Team"
import { fetchApplicationRequest } from "../../../actions/application"
import {track} from "../../../libs/helpers";

class ConfigureAppStep4 extends Component {
  componentDidMount() {
    document.title = "Apphud | Configure app"
    window.scrollTo(0, 0)
  }

  componentWillMount() {
    this.props.fetchApplicationRequest(this.props.match.params.appId)
  }

  render() {
    const { appId } = this.props.match.params

    return (
      <div>
        <Team withoutLoader component={true} match={{ params: { appId } }} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    newapp: state.application
  }
}

const mapDispatchToProps = {
  fetchApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureAppStep4)
