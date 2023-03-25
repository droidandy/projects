import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import moment from 'moment'
import { media } from 'components/Media'
import { IconDate } from 'components/Icons'
import DateRange from './DateRange'
import Calendar from './Calendar'
import { noop } from 'lodash'

export default class DatePicker extends Component {
  state = {
    open: false
  }

  static defaultProps = {
    format: 'DD/MM/YYYY',
    formatInput: 'DD/MM/YYYY',
    changeHide: noop
  }

  componentDidMount() {
    this.event = ('ontouchstart' in window ? 'touchstart' : 'click')
  }

  handleClickOutside = e => {
    if (this.datepicker && !this.datepicker.contains(e.target)) {
      this.hidePicker(e)
    }
  }

  handleSelectInput = (e) => {
    const { handleSelectInput } = this.props
    if (handleSelectInput) handleSelectInput(e)
  }

  handleSelect = (e, value) => {
    const { handleSelect } = this.props
    if (handleSelect) {
      handleSelect(e, value)
    }
  }

  showPicker = (e) => {
    e.preventDefault()
    this.input.blur()
    document.addEventListener(this.event, this.handleClickOutside, false)
    this.setState({ open: true }, this.props.changeHide)
  }

  hidePicker = (e) => {
    if (e) e.preventDefault()
    this.input.blur()
    document.removeEventListener(this.event, this.handleClickOutside, false)
    this.setState(state => ({ open: false }))
  }

  get value() {
    const { value, formatInput, type } = this.props
    let val = ''
    if (type === 'rangePicker') {
      if (value && value.startDate) val = moment(value.startDate).format(formatInput)
      if (value && value.endDate) val += ' - ' + moment(value.endDate).format(formatInput)
    } else {
      if (value) val = moment(value).format(formatInput)
    }
    return val
  }

  get dateRange() {
    const { value, format } = this.props
    let range = {
      startDate: moment().format(format),
      endDate: moment().add(1, 'd').format(format)
    }
    if (value && value.startDate) {
      range.startDate = moment(value.startDate).format(format)
    }
    if (value && value.endDate) {
      range.endDate = moment(value.endDate).format(format)
    }
    return range
  }

  componentWillReceiveProps(newProps) {
    if (newProps.hide && this.state.open === newProps.hide) {
      this.setState({ open: false }, this.props.changeHide)
    }
  }

  render() {
    const {
      type,
      phone,
      className,
      border,
      disabled,
      minDate,
      showTime,
      handleSelectTime,
      onApply,
      position
    } = this.props
    const { open } = this.state

    const Picker = type === 'rangePicker' ? DateRangeStyled : CalendarStyled

    return <DatePickerContainer className={ className } innerRef={ node => this.datepicker = node }>
      <DateContainer>
        <DatePickerInput
          innerRef={ node => this.input = node }
          onClick={ this.showPicker }
          onChange={ this.handleSelectInput }
          onFocus={ this.showPicker }
          value={ this.value }
          readOnly={ !!phone }
          border={ border }
          disabled={ disabled }
          phone
        />
        <IconDateStyled color="#a8a8b5" />
      </DateContainer>
      <Picker
        open={ open }
        cellSize={ 24 }
        startDate={ this.dateRange.startDate }
        endDate={ this.dateRange.endDate }
        onInit={ (e) => type === 'rangePicker' && this.handleSelect(e, 'rangePicker') }
        onChange={ (e) => this.handleSelect(e, 'rangePicker') }
        calendars={ phone }
        singleRange={ type !== 'rangePicker' }
        onApply={ onApply }
        minDate={ minDate }
        disableOffset
        linkedCalendars
        showTime={ showTime }
        handleSelectTime={ handleSelectTime }
        position={ position }
      />
    </DatePickerContainer>
  }
}

const DatePickerContainer = styled.div`
  position: relative;
`

const DateContainer = styled.div`
  position: relative;
`

const DatePickerInput = styled.input`
  cursor: pointer;
  user-select: none;
  position: relative;
  width: ${props => props.phone ? '100%' : '240px'};
  height: 40px;
  border: none;
  border-radius: 4px;
  background-color: #ffffff;
  padding-right: 45px;
  padding-left: 15px;

  input-placeholder {
    font-size: 14px;
    text-align: left;

    color: #a9b1ba;
  }

  ${props => !props.disabled && css`
    &:hover {
      border-color: #f6b530;
    }
  `}

  ${media.phoneLarge`
    font-size: 16px;
 `}

 ${props => props.border && css`
    border-radius: 4px;
    border: solid 1px #a8a8b5;
 `}

 ${props => props.disabled && css`
    background-color: #ededed;
    border: solid 1px #a8a8b5;
    cursor: auto;
 `}
`

const DateRangeStyled = styled(DateRange)`
  position: absolute;
  width: ${props => props.calendars ? 'auto' : '500px'};
  top: 48px;
  ${props => props.position === 'left' ? css`left: 0px;` : css`right: 0px;`}
  z-index: 10;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  display: ${props => props.open ? 'block' : 'none'};
`

const CalendarStyled = styled(Calendar)`
  position: absolute;
  top: 48px;
  ${props => props.position === 'left' ? css`left: 0px;` : css`right: 0px;`}
  z-index: 10;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  display: ${props => props.open ? 'block' : 'none'};
`

const IconDateStyled = styled(IconDate)`
  position: absolute;
  top: 35%;
  right: 15px;
  z-index: 1;
`
