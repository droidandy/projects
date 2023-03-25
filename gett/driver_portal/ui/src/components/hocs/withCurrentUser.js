import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default (ComposedComponent) => {
  const ResultComponent = class extends Component {
    render() {
      const {
        currentUser,
        logout,
        showSystemMessage,
        hideSystemMessage,
        showStickyMessage,
        hideStickyMessage,
        setVehicle,
        showLayoutScroll,
        hideLayoutScroll
      } = this.context

      return (
        <ComposedComponent
          { ...this.props }
          logout={ logout }
          showSystemMessage={ showSystemMessage }
          hideSystemMessage={ hideSystemMessage }
          showStickyMessage={ showStickyMessage }
          hideStickyMessage={ hideStickyMessage }
          setVehicle={ setVehicle }
          currentUser={ currentUser }
          showLayoutScroll={ showLayoutScroll }
          hideLayoutScroll={ hideLayoutScroll }
        />
      )
    }
  }

  ResultComponent.contextTypes = {
    currentUser: PropTypes.object,
    logout: PropTypes.func,
    showSystemMessage: PropTypes.func,
    hideSystemMessage: PropTypes.func,
    showStickyMessage: PropTypes.func,
    hideStickyMessage: PropTypes.func,
    setVehicle: PropTypes.func,
    showLayoutScroll: PropTypes.func,
    hideLayoutScroll: PropTypes.func
  }

  return ResultComponent
}
