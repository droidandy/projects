import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import Aux from "../../../hoc/Aux"

const DEFAULT_TAB = 0
const DEFAULT_TITLE = "No title"

class Tabs extends Component {
  state = {
    tab: DEFAULT_TAB
  };

  tabClassNames = (index) => {
    const { tab } = this.state

    return classNames("tabs__tab-item cp", {
      "tabs__tab-item_active": tab === index
    })
  };

  handleChangeTab = (tab) => {
    this.setState({ tab })

    if (this.props.hasOwnProperty("onChange")) this.props.onChange(tab)
  };

  updateCurrentTab = (props) => {
    if (props.hasOwnProperty("currentTab")) { this.setState({ tab: props.currentTab }) }
  };

  componentDidMount() {
    this.updateCurrentTab(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateCurrentTab(nextProps)
  }

  render() {
    const { tab } = this.state
    const { children, className, contentClassName } = this.props
    const childrenTabs = React.Children.toArray(children).filter(
      (node) =>
        node.type &&
        node.type.displayName &&
        node.type.displayName.toLowerCase() === "tab"
    )

    return (
      <div>
        <div className={"tabs " + className ? className : ""}>
          {childrenTabs.map((tab, index) => (
            <div
              key={index}
              className={this.tabClassNames(index)}
              onClick={this.handleChangeTab.bind(null, index)}
            >
              {tab.props && tab.props.title ? tab.props.title : DEFAULT_TITLE}
            </div>
          ))}
        </div>
        <div className={contentClassName || ""}>
          {childrenTabs.slice(parseFloat(tab), parseFloat(tab) + 1)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Tabs)
