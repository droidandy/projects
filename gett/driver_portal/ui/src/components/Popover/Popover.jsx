import React, { Component } from 'react'
import styled from 'styled-components'

class Popover extends Component {
  state = {
    activated: false
  }

  render() {
    const { className, width, message, children } = this.props
    const { activated } = this.state

    return (
      <Wrapper>
        <div
          onMouseEnter={ this.open }
          onMouseLeave={ this.close }
          onClick={ this.toggle }
        >
          { children }
        </div>
        <Body
          width={ width }
          className={ className }
          activated={ activated }
        >
          { message }
        </Body>
      </Wrapper>
    )
  }

  toggle = () => {
    this.state.activated ? this.close() : this.open()
  }

  open = () => {
    this.setState({ activated: true })
  }

  close = () => {
    this.setState({ activated: false })
  }
}

Popover.defaultProps = {
  width: 150
}

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: middle;
`

const Body = styled.div`
  visibility: ${props => props.activated ? 'visible' : 'hidden'};
  position: absolute;
  top: -15px;
  left: -${props => props.width / 2 - 5}px;
  padding: 10px;
  background: #282c37;
  border-radius: 4px 4px 0px 0px;
  color: #fff;
  animation-duration: .3s;
  z-index: 9;
  font-size: 12px;
  width: ${props => props.width}px;
  text-align: center;
  transform: translateY(-100%);

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 8px;
    display: block;
    left: 0;
    background: #282c37;
    z-index: 1;
    bottom: -5px;
    border-radius: 0px 0px 4px 4px;

  }

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    display: block;
    width: 10px;
    height: 10px;
    margin: auto;
    background: #282c37;
    transform: rotateZ(45deg);
  }
`

export default Popover
