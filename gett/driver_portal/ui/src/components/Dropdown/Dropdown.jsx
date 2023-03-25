import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { Overlay } from 'components/Overlay'

class Dropdown extends Component {
  state = {
    active: false
  }

  componentDidMount() {
    this.event = ('ontouchstart' in window ? 'touchstart' : 'click')
  }

  componentWillMount() {
    document.addEventListener('keydown', this.onDocumentKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onDocumentKeyDown)
  }

  calculateCustomDirection() {
    const menu = this.menu
    const { customDirection } = this.state
    if (menu) {
      const bottom = window.innerHeight - menu.getBoundingClientRect().top - menu.clientHeight
      if (bottom < 0 && customDirection !== 'up') {
        this.setState({ customDirection: 'up' })
      }
    }
  }

  componentDidUpdate() {
    if (!this.props.direction) this.calculateCustomDirection()
  }

  render() {
    const { active, customDirection } = this.state
    const { direction, nooverlay, className, indent, responsive, width, disabled } = this.props

    const trigger = React.cloneElement(this.props.trigger, {
      ...this.props.trigger.props,
      active: active,
      onClick: this.open
    })

    const items = React.Children.map(this.props.children, child => (
      child && React.cloneElement(child, {
        onClick: () => {
          child.props.onClick && child.props.onClick()
          this.close()
        }
      })
    ))

    return (
      <Wrapper
        disabled={ disabled }
        className={ className }
        innerRef={ node => this.dropdown = node }
        onClick={ e => e.stopPropagation() }
      >
        {!nooverlay && <Overlay active={ active } onClick={ this.close } /> }
        { trigger }
        { active && (
          <Menu
            width={ width }
            responsive={ responsive }
            indent={ indent }
            direction={ direction || customDirection }
            innerRef={ node => this.menu = node }
            onClick={ this.closeMenu }
          >
            { items }
          </Menu>
        )}
      </Wrapper>
    )
  }

  open = () => {
    const { disabled, nooverlay } = this.props
    if (disabled) return
    if (nooverlay) document.addEventListener(this.event, this.clickOutside, false)
    this.setState({ active: true })
  }

  close = () => {
    if (this.props.nooverlay) document.removeEventListener(this.event, this.clickOutside, false)
    this.setState({ active: false })
  }

  clickOutside = (e) => {
    if (this.dropdown && !this.dropdown.contains(e.target)) {
      this.close()
    }
  }

  closeMenu = () => {
    this.close()
  }

  onDocumentKeyDown = ({ code }) => {
    if (code === 'Escape') {
      this.close()
    }
  }
}

const Wrapper = styled.div`
  position: relative;
  opacity: ${props => props.disabled ? 0.5 : 1}
`

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: ${props => props.width || 180}px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #000000;
  z-index: 20;
  padding: 10px 0px;

  ${props => props.direction && props.direction === 'up' ? css`
    bottom: ${props => props.indent ? `${props.indent}px` : '20px'};
    right: 0;
  ` : css`
    top: ${props => props.indent ? `${props.indent}px` : '20px'};
    right: 0;
  `}
  
  ${props => props.responsive && css`
    left: 0;
    right: 0;
    width: auto;
  `}
`

export default Dropdown
