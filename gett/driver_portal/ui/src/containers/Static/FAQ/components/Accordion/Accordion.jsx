import React, { Component } from 'react'

export default class Accordion extends Component {
  renderSections = () => {
    const { children, id } = this.props
    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, { key: `${id}_${index}`, index })
    })
  }

  render() {
    return (
      <div>
        { this.renderSections() }
      </div>
    )
  }
}
