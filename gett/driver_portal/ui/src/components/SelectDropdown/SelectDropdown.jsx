import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { map, isArray, isObject } from 'lodash'

import { IconArrow } from 'components/Icons'
import { Overlay } from 'components/Overlay'

class Select extends Component {
  state = {
    active: false,
    selected: null,
    value: null
  }

  componentDidMount() {
    const { selected } = this.props
    this.event = ('ontouchstart' in window ? 'touchstart' : 'click')
    if (selected) {
      this.setState({ selected })
    }
  }

  componentWillMount() {
    document.addEventListener('keydown', this.onDocumentKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onDocumentKeyDown)
  }

  componentWillReceiveProps(newProps) {
    const { selected } = newProps
    if (this.props.selected !== selected) {
      this.setState({ selected })
    }
  }

  componentDidUpdate() {
    if (!this.props.direction) this.calculateCustomDirection()
  }

  render() {
    const {
      className,
      width,
      height,
      nooverlay,
      disabled,
      direction,
      top,
      bottom,
      menuHeight,
      styleDropdown,
      children
    } = this.props
    const { active, selected, customDirection } = this.state
    const { options, firstItem } = this.options

    return (
      <Wrapper innerRef={ node => this.selectDropdown = node } className={ className } onClick={ e => e.stopPropagation() }>
        {!nooverlay && <Overlay active={ active } onClick={ this.close } /> }
        <Dropdown
          onClick={ this.open }
          width={ width }
          height={ height }
          active={ active }
          disabled={ disabled }
          style={ styleDropdown }
        >
          {
            children
              ? React.Children.map(children, (child) => {
                if ((child.props.value && child.props.value === selected) || (!selected && child.props.value === firstItem)) {
                  return React.cloneElement(child)
                }
              })
              : selected || firstItem
          }
        </Dropdown>
        <Menu
          innerRef={ node => this.menu = node }
          active={ active }
          width={ width }
          height={ menuHeight }
          direction={ direction || customDirection }
          top={ top }
          bottom={ bottom }
        >
          {options}
        </Menu>
        <Suffix active={ active }>
          <IconArrow width="8" height="8" color={ active ? '#000000' : '#a8a8b5' } />
        </Suffix>
      </Wrapper>
    )
  }

  open = (e) => {
    e.preventDefault()
    const { onClick, disabled } = this.props
    if (!disabled) {
      if (onClick) onClick(e)
      if (this.props.nooverlay) document.addEventListener(this.event, this.clickOutside, false)
      this.setState({ active: true })
    }
  }

  close = (e) => {
    e.preventDefault()
    if (this.props.nooverlay) document.removeEventListener(this.event, this.clickOutside, false)
    this.setState({ active: false })
  }

  select = (value, selected) => {
    const { onChange, noSelect } = this.props
    if (noSelect) {
      typeof onChange === 'function'
        ? this.setState({ active: false }, () => onChange(value))
        : this.setState({ active: false })
    } else if (onChange) {
      this.setState({ selected, value, active: false }, () => onChange(value))
    } else {
      this.setState({ selected, value, active: false })
    }
  }

  clickOutside = (e) => {
    if (this.selectDropdown && !this.selectDropdown.contains(e.target)) {
      this.close(e)
    }
  }

  onDocumentKeyDown = (e) => {
    if (e.code === 'Escape') {
      this.close(e)
    }
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

  get options() {
    const { values, children, disabled } = this.props
    const result = {
      firstItem: null,
      options: []
    }
    if (isArray(values)) {
      result.options = map(values, (value, index) => {
        if (!result.firstItem) result.firstItem = value
        return (
          <SelectItem onClick={ () => this.select(value, value) } key={ index } value={ value }>{ value }</SelectItem>
        )
      })
    } else if (isObject(values)) {
      for (let key in values) {
        if (values.hasOwnProperty(key)) {
          if (!result.firstItem) result.firstItem = values[key]
          result.options.push(<SelectItem onClick={ () => this.select(key, values[key]) } key={ `key${key}` } value={ key }>{ values[key] }</SelectItem>)
        }
      }
    } else if (children) {
      result.options = React.Children.map(children, child => {
        if (!result.firstItem && child.props.value) result.firstItem = child.props.value

        return (
          !disabled && child && React.cloneElement(child, {
            onClick: () => {
              this.select(child.props.value, child.props.value)
            },
            selected: child.props.value === this.state.selected
          }))
      })
    }

    return result
  }
}

const Wrapper = styled.div`
  position: relative;
`

const Dropdown = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  margin: 0;
  padding-right: 16px;
  height: ${props => props.height ? props.height : 40}px;
  min-width: ${props => props.width ? props.width : 80}px;
  border-radius: 4px;
  background: #fff;
  border: solid 1px #a8a8b5;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  color: #000000;
  text-indent: 15px;
  appearance: none;

  ${props => props.active && css`
    border-color: #f6b530;
  `}

  ${props => !props.disabled && css`
    &:hover {
      border-color: #f6b530;
    }
  `}

  ${props => props.disabled && css`
    background-color: #ededed;
    border: solid 1px #a8a8b5;
    cursor: auto;
 `}
`

const Suffix = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 16px;
  margin: auto;
  width: 8px;
  height: 8px;
  padding: 0;
  transform: translateY(-40%);
  pointer-events: none;
  transform: rotate(-90deg);

  ${props => props.active && css`
    right: 4px;
    transform: rotate(90deg);
  `}
`

const Menu = styled.div`
  display: flex;
  max-height: ${props => props.height ? props.height : 200}px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  flex-direction: column;
  position: absolute;
  min-width: ${props => props.width ? props.width : 180}px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #000000;
  z-index: 20;
  padding: 10px 0px;
  visibility: ${props => props.active ? 'visible' : 'hidden'};
  appearance: none;
  align-items: start;

  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background-color: #fff;
  }

  &::-webkit-scrollbar {
    width: 6px;
    background-color: #fff;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #d8d8d8;
  }

  ${props => props.direction && props.direction === 'up' ? css`
    bottom: ${props => props.bottom ? props.bottom : 20}px;
    right: 0;
  ` : css`
    top: ${props => props.top ? props.top : 45}px;
    left: 0;

  `}
`

const SelectItem = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  padding: 15px 15px 15px 15px;
  height: 35px;
  min-height: 35px;
  &:hover {
    background-color: rgba(246, 181, 48, 0.2);
  }
`

export default Select
