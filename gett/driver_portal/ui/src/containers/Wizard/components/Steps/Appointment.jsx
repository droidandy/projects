import React, { Component, Fragment } from 'react'
import 'jquery'
import TimekitBooking from 'timekit-booking'
import styled from 'styled-components'
import { isEqual } from 'lodash'

import { Button } from 'components/Button'
import { media } from 'components/Media'
import { Form, Checkbox, bindState } from 'components/form'

const TIMEKIT_APP = process.env.REACT_APP_TIMEKIT_APP
const TIMEKIT_EMAIL = process.env.REACT_APP_TIMEKIT_EMAIL
const TIMEKIT_API_TOKEN = process.env.REACT_APP_TIMEKIT_API_TOKEN

class AppointmentForm extends Form {
  state = {
    choosed: true
  }

  save = this.save.bind(this)

  componentWillReceiveProps(newProps) {
    const { attrs } = this.props
    const { attrs: { appointmentScheduled } } = newProps
    if (attrs.appointmentScheduled !== appointmentScheduled) {
      this.setState(state => ({
        choosed: appointmentScheduled
      }))
    }
  }

  $render($) {
    return (
      <Fragment>
        <CheckboxWrapper>
          <Checkbox { ...$('appointmentScheduled') } />
          <CheckBoxText>
          I choose my appointment time
          </CheckBoxText>
        </CheckboxWrapper>
        <ButtonStyled
          disabled={ !this.state.choosed }
          onClick={ this.save }
        >
          Next step
        </ButtonStyled>
      </Fragment>
    )
  }
}

class Appointment extends Component {
  componentDidMount() {
    const { currentUser } = this.props

    this.timekit = new TimekitBooking()
    this.timekit.init({
      app: TIMEKIT_APP,
      email: TIMEKIT_EMAIL,
      apiToken: TIMEKIT_API_TOKEN,
      avatar: currentUser.avatarUrl
    })

    this.setState({ form: currentUser })
  }

  componentWillReceiveProps(newProps) {
    const { currentUser } = newProps
    if (!isEqual(this.props.currentUser, currentUser)) {
      this.setState({ form: currentUser })
    }
  }

  render() {
    return (
      <Wrapper>
        <div id="bookingjs" />
        <AppointmentForm
          onRequestSave={ this.save }
          ref={ form => this.form = form }
          { ...bindState(this) }
        />

      </Wrapper>
    )
  }

  save = (data) => {
    this.props.onRequestSave(data, 3)
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  min-height: 586px;
  padding: 20px 20px 30px;
  
  ${media.phoneLarge`
    width: 90%;
    margin: auto;
    padding: 20px 0 30px;
  `}
`

const CheckBoxText = styled.div`
  font-size: 14px;
  font-weight: normal;
  color: #303030;
  margin-left: 15px;
`

const CheckboxWrapper = styled.div`
  display: flex;
  margin-top: 30x;
  
  ${media.phoneLarge`
    margin-top: 20px;
  `}
`

const ButtonStyled = styled(Button)`
  margin-top: 20px;
`

export default Appointment
