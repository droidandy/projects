import React, { Component } from 'react'
import styled from 'styled-components'
import { map } from 'lodash'
import { breakpoints } from 'components/Media'
import StickyMessage from './StickyMessage'

class StickyMessages extends Component {
  render() {
    const { onClose } = this.props

    const messages = map(this.props.messages, message => (
      <StickyMessage
        { ...message }
        key={ message.uuid }
        onClose={ () => onClose(message) }
      >
        { message.text }
      </StickyMessage>
    ))

    return (
      <Container>{ messages }</Container>
    )
  }
}

const Container = styled.div`
  position: fixed;
  z-index: 10;
  bottom: auto;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${breakpoints.phoneLarge`
    top: 30px;
    right: 30px;
    left: auto;
    align-items: flex-start;
    justify-content: flex-start;

  `}
`

export default StickyMessages
