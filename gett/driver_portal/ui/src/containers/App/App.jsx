import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import { SystemMessages } from './components/SystemMessages'
import { StickyMessages } from './components/StickyMessages'
import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

class App extends Component {
  state = {
    scroll: true
  }

  componentDidMount() {
    this.props.loadCurrentUser()
  }

  getChildContext() {
    return {
      currentUser: this.props.currentUser,
      logout: this.logout,
      showSystemMessage: this.showSystemMessage,
      hideSystemMessage: this.hideSystemMessage,
      showStickyMessage: this.showStickyMessage,
      hideStickyMessage: this.hideStickyMessage,
      setVehicle: this.updateCurrentVehicle,
      showLayoutScroll: this.showLayoutScroll,
      hideLayoutScroll: this.hideLayoutScroll
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { currentUser } = nextProps
    if (currentUser.loading) return false
    return true
  }

  render() {
    const { currentUser, systemMessages, stickyMessages } = this.props
    const { scroll } = this.state

    if (currentUser.loading) {
      return null
    }

    return (
      <Body scroll={ scroll }>
        {
          !isEmpty(stickyMessages) && <StickyMessages
            onClose={ this.hideStickyMessage }
            messages={ stickyMessages }
          />
        }

        {
          !isEmpty(systemMessages) && <SystemMessages
            onClose={ this.hideSystemMessage }
            messages={ systemMessages }
          />
        }

        { this.props.children }
      </Body>
    )
  }

  logout = () => {
    const { logout, currentUser } = this.props
    logout({ currentUser })
  }

  updateCurrentVehicle = (vehicle) => {
    this.props.updateCurrentVehicle({ vehicle })
  }

  showSystemMessage = (message) => {
    this.props.showSystemMessage({ ...message })
  }

  hideSystemMessage = (message) => {
    this.props.hideSystemMessage({ ...message })
  }

  showStickyMessage = (message) => {
    this.props.showStickyMessage({ ...message })
  }

  hideStickyMessage = (message) => {
    this.props.hideStickyMessage({ ...message })
  }

  showLayoutScroll = () => {
    this.setState({
      scroll: true
    })
  }

  hideLayoutScroll = () => {
    this.setState({
      scroll: false
    })
  }
}

App.childContextTypes = {
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

const Body = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
  height: 100%;
  ${props => !props.scroll && css`
    overflow: hidden
  `}
`

export default connect(mapStateToProps, mapDispatchToProps)(App)
