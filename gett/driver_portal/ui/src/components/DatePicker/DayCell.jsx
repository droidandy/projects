import React, { Component } from 'react'
import styled from 'styled-components'

class DayCell extends Component {
  state = {
    hover: false,
    active: false
  }

  handleMouseEvent = (event) => {
    event.preventDefault()
    if (this.props.isPassive) return null

    const newState = {}

    switch (event.type) {
      case 'mouseenter':
        newState['hover'] = true
        break
      case 'mouseup':
      case 'mouseleave':
        newState['hover'] = false
        newState['active'] = false
        break
      case 'mousedown':
        newState['active'] = true
        break
      default:
        break
    }

    this.setState(newState)
  }

  handleSelect = (event) => {
    event.preventDefault()
    if (this.props.isPassive) return null
    this.props.onSelect(this.props.dayMoment)
  }

  render() {
    const {
      dayMoment,
      className,
      isPassive,
      isSelected,
      isInRange,
      isToday,
      isSunday,
      isSpecialDay,
      cellSize
    } = this.props
    const { hover, active } = this.state

    return (
      <DayWrapper
        className={ className }
        onClick={ this.handleSelect }>
        <Day
          onMouseEnter={ this.handleMouseEvent }
          onMouseLeave={ this.handleMouseEvent }
          onMouseDown={ this.handleMouseEvent }
          onMouseUp={ this.handleMouseEvent }
          cellSize={ cellSize }

          isPassive={ isPassive }
          hover={ hover }
          active={ active }
          isSelected={ isSelected }
          isInRange={ isInRange }
          isToday={ isToday }
          isSunday={ isSunday }
          isSpecialDay={ isSpecialDay }>
          { dayMoment.date() }
        </Day>
      </DayWrapper>
    )
  }
}

const DayWrapper = styled.span`
  box-sizing: border-box;
  display: inline-block;
  letter-spacing: initial;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  transition: transform .1s ease;
  margin-bottom: 2px;
`

const Day = styled.span`
  box-sizing: border-box;
  display: inline-block;
  letter-spacing: initial;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  transition: transform .1s ease;
  /* cell size */
  width: ${props => props.cellSize ? props.cellSize + 10 : 37}px;
  height: ${props => props.cellSize ? props.cellSize : 37}px;
  line-height: ${props => props.cellSize ? props.cellSize : 37}px;
  
  /* Day Passive */
  ${props => props.dayPassive ? `
    opacity: 0.4,
    cursor: 'normal'
  ` : ``}
  
  /* Day Hover */
  ${props => props.hover ? `
    background: #f6b530;
    border-radius: 4px;
  ` : ``}
  
  /* Day Selected */
  ${props => props.isSelected ? `
    background: #f6b530;
    border-radius: 4px;
  ` : ``}
  
  /* Day in Range */
  ${props => !props.hover && !props.isSelected && props.isInRange ? `
    opacity: 0.5;
    background: #f6b530;
  ` : ``}
  
  ${props => !props.isInRange && props.active ? `
    background: #95a5a6;
    color: #ffffff;
    transform: scale(0.9);
  ` : ``}
  
  /* Anothe month days */
  ${props => props.isPassive ? `
    opacity: 0.4;
    cursor: normal;
    ` : ``}
`

export default DayCell
