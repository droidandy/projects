import React, { Component } from 'react'
import styled from 'styled-components'

import { DatePicker } from 'components/DatePicker'
import { Checkbox } from 'components/Checkbox'

class Filter extends Component {
  render() {
    const {
      datepicker,
      hidePicker,
      today,
      todayCheck,
      assignShow,
      assignShowCheck,
      handleDatePicker,
      handleChangePicker
    } = this.props
    return (
      <Wrapper>
        <Right>
          <div>
            <Label>
            Due date
            </Label>
            <DatePicker
              type="rangePicker"
              handleSelect={ handleDatePicker }
              value={ datepicker }
              disabled={ datepicker.disabled }
              hide={ hidePicker }
              changeHide={ handleChangePicker }
              position="left"
            />
          </div>
          <Today>
            <Checkbox
              checked={ today }
              onClick={ todayCheck }
            />
            <Text>
              Today
            </Text>
          </Today>
        </Right>
        <Left>
          <Checkbox
            checked={ assignShow }
            onClick={ assignShowCheck }
          />
          <Text>
            Show drivers to be assigned
          </Text>
        </Left>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  display: flex;
  padding: 20px 30px 0;
  justify-content: space-between;
`

const Label = styled.div`
  font-size: 10px;
  color: #a9b1ba;
  text-transform: uppercase;
  margin-bottom: 8px;
`

const Today = styled.div`
  margin: 12px 0 0 30px;
  display: flex;
  align-items: center;
`

const Right = styled.div`
  display: flex;
  align-items: center;
`

const Left = styled(Right)`
  margin-top 12px;
`

const Text = styled.div`
  margin-left: 10px;
  font-size: 14px;
`

export default Filter
