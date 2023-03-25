import React, { Component } from 'react'
import styled from 'styled-components'

class ScrollableBody extends Component {
  render() {
    return (
      <Body>
        { this.props.children }
      </Body>
    )
  }
}

const Body = styled.div`
  display: block;
  width: 100%;
  height: calc(100vh - 290px);
  overflow-y: auto;
`

export default ScrollableBody
