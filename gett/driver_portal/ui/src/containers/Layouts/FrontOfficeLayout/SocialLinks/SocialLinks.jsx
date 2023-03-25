import React, { Component } from 'react'
import styled from 'styled-components'

import { IconTwitter, IconFacebook } from 'components/Icons'

class SocialLinks extends Component {
  state = {
    twitterHover: false,
    fbHover: false
  }

  reset = () => {
    this.setState({
      twitterHover: false,
      fbHover: false
    })
  }

  hover = (val) => {
    val = `${val}Hover`
    this.setState({ [val]: true })
  }

  render() {
    const { isOpen } = this.props
    const { twitterHover, fbHover } = this.state

    return (<Wrapper isOpen={ isOpen }>
      <LinkStyled
        target="_blank"
        rel="noopener noreferrer"
        href="https://twitter.com/GettDrivers_UK"
        onMouseOver={ () => this.hover('twitter') }
        onMouseOut={ this.reset }
      >
        <IconTwitter color={ twitterHover ? '#757683' : '#A8A8B5' } />
      </LinkStyled>
      <LinkStyled
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.facebook.com/GettDriversUK/"
        onMouseOver={ () => this.hover('fb') }
        onMouseOut={ this.reset }>
        <IconFacebook color={ fbHover ? '#757683' : '#A8A8B5' } />
      </LinkStyled>
    </Wrapper>)
  }
}

const Wrapper = styled.div`
  width: 270px;
  display: flex;
  justify-content: center;
  
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: opacity ${props => props.isOpen ? '1.5s' : '0.8s'} ease-in-out;
`

const LinkStyled = styled.a`
  padding: 10px;
`

export default SocialLinks
