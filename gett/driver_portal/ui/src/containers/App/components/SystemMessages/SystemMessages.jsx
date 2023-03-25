import React, { Component } from 'react'
import { map } from 'lodash'
import SystemMessage from './SystemMessage'

class SystemMessages extends Component {
  render() {
    const { onClose } = this.props

    const messages = map(this.props.messages, message => (
      <SystemMessage
        { ...message }
        onClose={ () => onClose(message) }
        key={ message.uuid }
      >
        { message.text }
      </SystemMessage>
    ))

    return (
      <div>{ messages }</div>
    )
  }
}

export default SystemMessages
