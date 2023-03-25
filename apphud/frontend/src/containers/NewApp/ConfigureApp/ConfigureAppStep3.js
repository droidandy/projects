import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import history from "../../../history"
import AddProducts from "./AddProducts/AddProducts"
import { fetchApplicationRequest } from "../../../actions/application"
import ProductStructure from "../../../components/ProductStructure";
import {track} from "../../../libs/helpers";

class ConfigureAppStep3 extends Component {
  next = (e) => {
    history.push({
      pathname: `/configureapp/${this.props.match.params.appId}/4`,
      search: this.props.history.location.search
    })
    track("onboarding_products_continue_button_clicked")
  };

  componentWillMount() {
    this.props.fetchApplicationRequest(this.props.match.params.appId)
  }

  componentDidMount() {
    document.title = "Apphud | Configure app"
    window.scrollTo(0, 0)

  }

  render() {
    return (
      <div className="text-black">
        <div className="dashboard-checklist dashboard-checklist_mb0 mb30">
          <div className="dashboard-checklist__content mt0">
            Configure products structure.&nbsp;
            <a href="#" className="link link_normal" target="_blank" onClick={() => track("onboarding_products_learn_more_link_clicked")}>Learn more</a>
          </div>
        </div>
        <div>
          <ProductStructure appId={this.props.match.params.appId} hideHeading={true} />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureAppStep3)
