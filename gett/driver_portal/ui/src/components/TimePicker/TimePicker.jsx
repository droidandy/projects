import React, { PureComponent } from 'react'
import styled from 'styled-components'
import moment from 'moment'

import { IconSmallArrow } from 'components/Icons'

const HOUR_STEP = 1
const MINUTES_STEP = 10

const Picker = ({ onClick, value, onChange }) => (
  <PickerWrapper>
    <Input value={ value } onChange={ (e) => onChange(null, e) } />
    <PickerButtons>
      <Btn onClick={ () => onClick('up') }>
        <IconSmallArrowUp />
      </Btn>
      <Btn onClick={ () => onClick('down') }>
        <IconSmallArrow />
      </Btn>
    </PickerButtons>
  </PickerWrapper>
)

class TimePicker extends PureComponent {
  state = {
    hours: '12',
    minutes: '00'
  }

  render() {
    const { label } = this.props
    const { hours, minutes } = this.state

    return (
      <Wrapper>
        <Label>
          { label || 'Time' }
        </Label>
        <PickerWrapper>
          <Picker
            value={ hours }
            onClick={ this.changeHour }
            onChange={ this.changeHour }
          />
          <Delimeter>:</Delimeter>
          <Picker
            value={ minutes }
            onClick={ this.changeMinute }
            onChange={ this.changeMinute }
          />
        </PickerWrapper>
      </Wrapper>
    )
  }

  changeHour = (type, e) => {
    let { hours } = this.state
    if (e && e.target.value) {
      hours = ~~e.target.value
    } else {
      hours = type === 'up' ? ~~hours + HOUR_STEP : ~~hours - HOUR_STEP
    }
    if (hours < 0 || hours > 23) return
    if (hours < 10) hours = '0' + hours

    this.setState({ hours }, () => this.props.onChange(moment(this.value, 'HH:mm')))
  }

  changeMinute = (type, e) => {
    let { minutes } = this.state
    if (e && e.target.value) {
      minutes = ~~e.target.value
    } else {
      minutes = type === 'up' ? ~~minutes + MINUTES_STEP : ~~minutes - MINUTES_STEP
    }
    if (minutes < 0 || minutes > 59) return
    if (minutes < 10) minutes = '0' + minutes

    this.setState({ minutes }, () => this.props.onChange(moment(this.value, 'HH:mm')))
  }

  get value() {
    const { hours, minutes } = this.state
    return `${hours}:${minutes}`
  }
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  justify-content: space-between;
`

const Label = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #8794a0;
`

const PickerWrapper = styled.div`
  display: flex;
`

const PickerButtons = styled.div`
  display: flex;
  flex-direction: column;
`

const Input = styled.input`
  width: 40px;
  height: 40px;
  border: solid 1px #a8a8b5;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  padding: 10px;
  
  &::input-placeholder {
    font-size: 14px;
    text-align: left;
    color: #a8a8b5;
    font-weight: 300;
  }
  
  &:focus {
    outline: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border: 1px solid #f6b530;
  }
`

const Btn = styled.div`
  width: 20px;
  height: 20px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #e9e9e9;
  cursor: pointer;
  text-align: center;
  
  &:hover {
    background-color: #f6b530;
  }
`

const Delimeter = styled.div`
  margin: 10px;
`

const IconSmallArrowUp = styled(IconSmallArrow)`
  transform: rotate(180deg);
`

export default TimePicker
