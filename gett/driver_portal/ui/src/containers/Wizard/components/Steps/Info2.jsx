import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { isEqual } from 'lodash'

import { media } from 'components/Media'
import { bindState } from 'components/form'

import { InfoForm2 } from '../Forms'

class Info2 extends Component {
  componentDidMount() {
    const { currentUser } = this.props
    this.setState({ form: currentUser })
  }

  componentWillReceiveProps(newProps) {
    const { currentUser, errors } = newProps
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
        <InfoForm2
          onRequestSave={ this.save }
          ref={ form => this.form = form }
          { ...bindState(this) }
        />
        <Dots>
          <Dot />
          <Dot active />
        </Dots>
      </Wrapper>
    )
  }

  save = (data) => {
    this.props.onRequestSave(data, 2)
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

export default Info2
