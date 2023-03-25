import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { DatePicker as DatePickerBase } from 'components/DatePicker'
import styled from 'styled-components'
import moment from 'moment'

class DateTimePicker extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    error: PropTypes.string
  }

  state = {
    hidePicker: false,
    date: moment.utc().format('YYYY-MM-DD'),
    time: moment.utc().format('HH:mm')
  }

  render() {
    const { error, ...rest } = this.props
    const { hidePicker } = this.state

    return (
      <div>
        <DatePickerBase
          handleSelect={ this.onChangeDate }
          hide={ hidePicker }
          changeHide={ this.handleHide }
          handleSelectTime={ this.onChangeTime }
          onApply={ this.onApply }
          format="YYYY-MM-DDTHH:mmZ"
          formatInput="YYYY/MM/DD HH:mm"
          showTime
          { ...rest }
        />
        { error && <Error>{ error }</Error> }
      </div>
    )
  }

  onChangeDate = (moment) => {
    this.setState({
      date: moment.utc().format('YYYY-MM-DD')
    }, () => this.props.onChange(this.value))
  }

  onChangeTime = (moment) => {
    this.setState({
      time: moment.utc().format('HH:mm')
    }, () => this.props.onChange(this.value))
  }

  onApply = () => {
    this.setState({ hidePicker: true })
  }

  handleHide = () => {
    this.setState({ hidePicker: false })
  }

  get value() {
    const { date, time } = this.state
    return `${date}T${time}:00Z`
  }
}

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #f00;
  margin-top: 10px;
`

export default DateTimePicker
