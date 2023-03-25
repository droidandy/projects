import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import ScreensBuilder from "./ScreensBuilder"
import ScreensSelectTemplate from "./ScreensSelectTemplate"

class ScreensBuilderIndex extends Component {
  state = {
    screenId: "new"
  };

  componentWillMount() {
    this.setState({ screenId: this.props.screenId })
    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop
  }

  componentDidMount() {
    document.body.style.overflow = "hidden"
  }

  componentWillUnmount() {
    document.body.style.overflow = ""
    document.documentElement.scrollTop = document.body.scrollTop = this.scrollTop
  }

  handleChangeScreenId = (screenId) => {
    this.setState({ screenId })
  };

  render() {
    const { screenId } = this.state

    if (screenId === "new") {
      return (
        <ScreensSelectTemplate
          handleChangeScreenId={this.handleChangeScreenId}
          {...this.props}
        />
      )
    } else return <ScreensBuilder {...this.props} screenId={screenId} />
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreensBuilderIndex)
