import React, { Component } from 'react'
import styled from 'styled-components'

class GridBody extends Component {
  render() {
    return (
      <Body>
        { this.props.children }
      </Body>
    )
  }
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export default GridBody
