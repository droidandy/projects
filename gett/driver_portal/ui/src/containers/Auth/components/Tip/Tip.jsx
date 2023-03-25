import React, { Component } from 'react'
import styled from 'styled-components'
import { IconClose } from 'components/Icons'

class Tip extends Component {
  state = {
    display: true
  }

  render() {
    const { children } = this.props
    const { display } = this.state

    return (
      <Wrapper displayTip={ display }>
        <Closer color={ '#fff' } onClick={ () => this.setState({ display: false }) } />
        { children }
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  display: ${({ displayTip }) => displayTip ? 'inline-table' : 'none'}; 
  color: #fff;
  line-height: 1.5;
  opacity: .9;
  background-color: #282c37;
  padding: 0 40px 0 20px;
  max-width: 280px;
  width: auto;
  position: relative;
  border-radius: 3px;
  font-size: 14px;
  margin-top: 13px;
  &:before{
    content: '';
    width: 0;
    height: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-bottom: 11px solid #282c37;
    position: absolute;
    top: -11px;
  }
`
const Closer = styled(IconClose)`
  position: absolute;
  right: 7px;
  top: 7px;
  cursor: pointer;
`

export default Tip
