import React, { Component } from 'react'
import styled from 'styled-components'
import { MediaQuery } from 'components/MediaQuery'

class GridHeaders extends Component {
  render() {
    const { visibleFrom, visibleTill } = this.props

    return (
      <MediaQuery minWidth={ visibleFrom } maxWidth={ visibleTill }>
        <Wrapper>
          { this.props.children }
        </Wrapper>
      </MediaQuery>
    )
  }
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px;
  height: 46px;
`

export default GridHeaders
