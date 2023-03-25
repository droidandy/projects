import React, { Component } from 'react'
import styled, { css } from 'styled-components'

class Dots extends Component {
  state = {
    hovered: false
  }

  render() {
    const dark = this.props.active || this.state.hovered

    return (
      <Wrapper onClick={ this.props.onClick } onMouseEnter={ this.dark } onMouseLeave={ this.light } >
        <Dot dark={ dark } />
        <Dot dark={ dark } />
        <Dot dark={ dark } />
      </Wrapper>
    )
  }

  dark = () => {
    this.setState({ hovered: true })
  }

  light = () => {
    this.setState({ hovered: false })
  }
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  padding: 10px 0px;
`

const Dot = styled.span`
  height: 4px;
  width: 4px;
  background-color: #d8d8d8;
  border-radius: 50%;
  margin: 0px 1px;

  ${props => props.dark && css`
    background-color: #6e7a87;
  `}
`

export default Dots
