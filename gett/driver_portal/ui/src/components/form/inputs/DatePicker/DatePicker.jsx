import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { DatePicker as DatePickerBase } from 'components/DatePicker'
import styled from 'styled-components'

class DatePicker extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    error: PropTypes.string
  }

  state = {
    hidePicker: false
  }

  onChange = (moment) => {
    this.props.onChange(moment.format('YYYY-MM-DD'))
    this.setState({ hidePicker: true })
  }

  handleHide = () => {
    this.setState({ hidePicker: false })
  }

  render() {
    const { error, ...rest } = this.props
    const { hidePicker } = this.state

    return (
      <div>
        <DatePickerBase
          handleSelect={ this.onChange }
          hide={ hidePicker }
          changeHide={ this.handleHide }
          { ...rest }
        />
        { error && <Error>{ error }</Error> }
      </div>
    )
  }
}

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #f00;
  margin-top: 10px;
`

export default DatePicker
