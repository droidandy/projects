import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { map } from 'lodash'

import { IconArrow } from 'components/Icons'
import { Overlay } from 'components/Overlay'

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
  '#980001', '#FF0002', '#FF9901', '#FFFF02', '#00FF02', '#02FEFF', '#4A86E8', '#0000FF', '#9902FF', '#FF02FF',
  '#E6B8AF', '#F4CCCD', '#F7B26A', '#FFD965', '#93C47D', '#75A5AF', '#6D9EEC', '#CFE2F3', '#8E7BC3', '#C27B9F',
  '#DD7E6A', '#EB9999', '#F9CC9C', '#FFE599', '#B6D7A8', '#A2C4CA', '#A4C2F4', '#9FC5E9', '#B4A7D6', '#D5A6BD',
  '#CC4125', '#E06566', '#F7B26A', '#FFD965', '#93C47D', '#75A5AF', '#6D9EEC', '#6FA8DC', '#8E7BC3', '#C27B9F',
  '#A61C01', '#CC0000', '#E69038', '#F1C232', '#69A84E', '#44818E', '#3B78D8', '#3D85C6', '#664EA7', '#A54C78',
  '#84200C', '#990001', '#B45E07', '#BF9000', '#38761E', '#134F5C', '#1254CC', '#0A5294', '#351D75', '#731C47',
  '#5B0F00', '#650000', '#783F05', '#7F6000', '#284E13', '#0D343D', '#1C4587', '#073762', '#20134C', '#4C1030'
]

class SelectColor extends Component {
  state = {
    active: false,
    selected: COLORS[0]
  }

  componentDidMount() {
    this.event = ('ontouchstart' in window ? 'touchstart' : 'click')
  }

  render() {
    const { className, width, height, nooverlay } = this.props
    const { active, selected } = this.state
    return (
      <Wrapper innerRef={ node => this.selectColor = node } className={ className } onClick={ e => e.stopPropagation() }>
        {!nooverlay && <Overlay active={ active } onClick={ this.close } /> }
        <Dropdown
          onClick={ this.open }
          width={ width }
          height={ height }>
          <ColorActive color={ selected } />
        </Dropdown>
        <Menu active={ active }>
          {this.renderColor()}
        </Menu>
        <Suffix>
          <IconArrow width="8" height="8" />
        </Suffix>
      </Wrapper>
    )
  }

  open = (e) => {
    e.preventDefault()
    const { onClick } = this.props
    if (onClick) onClick(e)
    document.addEventListener(this.event, this.clickOutside, false)
    this.setState({ active: true })
  }

  close = (e) => {
    e.preventDefault()
    document.removeEventListener(this.event, this.clickOutside, false)
    this.setState({ active: false })
  }

  select = (color) => {
    const { onChange } = this.props
    if (onChange) {
      this.setState({ selected: color, active: false }, onChange(color))
    }
  }

  clickOutside = (e) => {
    if (this.selectColor && !this.selectColor.contains(e.target)) {
      this.close(e)
    }
  }

  renderColor() {
    return map(COLORS, (color, index) => (
      <Color onClick={ () => this.select(color) } key={ `color_${index}` } color={ color } />
    ))
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
  padding-left: 15px;
  padding-right: 16px;
  height: ${props => props.height ? props.height : 40}px;
  min-width: ${props => props.width ? props.width : 80}px;
  border-radius: 4px;
  background: #fff;
  border: solid 1px #a8a8b5;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  text-indent: 15px;
  appearance: none;
  
  &:hover {
    border-color: #f6b530;
  }
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
`

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: absolute;
  width: 200px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #000000;
  z-index: 20;
  padding: 5px;
  visibility: ${props => props.active ? 'visible' : 'hidden'};

  ${props => props.direction && props.direction === 'up' ? css`
    bottom: 20px;
    right: 0;
  ` : css`
    top: 30px;
    left: 0;

  `}
`

const Color = styled.div`
  width: 15px;
  height: 15px;
  margin: 2px;
  cursor: pointer;
  
  ${props => props.color && css`
    background-color: ${props.color}
  `}
`

const ColorActive = styled(Color)`
  width: 20px;
  height: 20px;
`

export default SelectColor
