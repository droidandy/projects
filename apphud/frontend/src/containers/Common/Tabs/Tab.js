import React, { Component } from "react"
import { connect } from "react-redux"

class Tab extends Component {
  render() {
    return this.props.children
  }
}

Tab.displayName = "tab"

export default Tab
