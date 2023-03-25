import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { isEqual } from 'lodash'

import { media } from 'components/Media'
import { bindState } from 'components/form'

import { InfoForm } from '../Forms'

const DEFAULT_MIN_YEAR = 1980
const DEFAULT_SELECTED_YEAR = 2015

class Info extends Component {
  componentDidMount() {
    const { currentUser, history } = this.props
    if (currentUser.onboardingStep > 1) history.push(`/wizard/2`)
    this.setState({ form: { vehicleRegYear: DEFAULT_SELECTED_YEAR, minRidesNumber: 0, ...this.props.currentUser } })
  }

  componentWillReceiveProps(newProps) {
    const { currentUser, history, errors } = newProps
    if (currentUser.onboardingStep > 1) history.push(`/wizard/2`)
    if (!isEqual(this.props.currentUser, currentUser)) {
      this.setState({ form: currentUser })
    }
    if (errors !== this.props.errors) {
      this.form.setErrors(errors)
    }
  }

  render() {
    return (
      <Wrapper>
        <Title>
          Please answer the below questions
        </Title>
        <InfoForm
          minYear={ DEFAULT_MIN_YEAR }
          onRequestSave={ this.save }
          ref={ form => this.form = form }
          { ...bindState(this) }
        />
        <Dots>
          <Dot active />
          <Dot />
        </Dots>
      </Wrapper>
    )
  }

  save = (data) => {
    if (data.minRidesNumber) data.minRidesNumber = ~~data.minRidesNumber
    this.props.onRequestSave(data, 1)
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  min-height: 585px;
  padding: 40px;
  ${media.phoneLarge`
    width: 90%;
    margin: auto;
  `}
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`

const Dots = styled.div`
  display: flex;
`

const Dot = styled.div`
  height: 12px;
  width: 12px;
  background-color: #fff;
  border-radius: 50%;
  margin-left: 15px;
  border: solid 1px #d2dadc;
  cursor: pointer;
  
  ${props => props.active && css`
    background-color: #f6b530;
    border: none;
  `}
`

export default Info
