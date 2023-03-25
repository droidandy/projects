import React from 'react'
import ReactDOM from 'react-dom'

const withPortal = () => (ComposedComponent) => class extends React.Component {
  container = null

  componentDidMount() {
    this.container = document.createElement('div')
    document.body && document.body.appendChild(this.container)
    this.renderLayer()
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.container)
    document.body && this.container && document.body.removeChild(this.container)
  }

  componentDidUpdate() {
    this.renderLayer()
  }

  renderLayer() {
    const element = <ComposedComponent { ...this.props } />
    ReactDOM.unstable_renderSubtreeIntoContainer(this, element, this.container)
  }

  render() {
    return null
  }
}

export default withPortal
