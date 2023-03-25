import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"

class TextCounter extends Component {
  state = {
    currentValue: 0
  };

  update = (props = this.props) => {
    this.setState({
      currentValue: props.text.length
    })
  };

  componentDidMount() {
    this.update()
  }

  componentWillReceiveProps(nextProps) {
    this.update(nextProps)
  }

  counterClasses = () => {
    const { max } = this.props
    return classNames("text-counter", {
      "text-counter_red": this.state.currentValue > max
    })
  };

  render() {
    const { max } = this.props
    const { currentValue } = this.state

    return (
      <div className={this.counterClasses()}>
        {currentValue}/{max}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TextCounter)
