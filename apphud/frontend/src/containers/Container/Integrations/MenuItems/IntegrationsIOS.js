import React, { Component } from 'react';
import { connect } from "react-redux"
import { fetchApplicationRequest } from "../../../../actions/application"
import IntegrationsList from "../IntegrationsList"

class IntegrationsIOS extends Component {
  render() {
    return (
      <IntegrationsList platform="ios" {...this.props}/>
    );
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapStateToProps)(IntegrationsIOS);
