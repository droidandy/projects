import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import styled, { css } from 'styled-components'

import { IconSuccessOutline, IconErrorOutline } from 'components/Icons'
import { media } from 'components/Media'

const steps = [
  'Sign up',
  'Personal information',
  'Schedule an appointment',
  'Documents',
  'Welcome session'
]

class Header extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    currentStep: PropTypes.number,
    failed: PropTypes.bool
  }
  render() {
    const { onClick, currentStep, failed, currentUser: { onboardingStep } } = this.props
    return (
      <Fragment>
        <Wrapper>
          { map(steps, (label, i) => {
            const currentWizardStep = currentStep >= 2 ? currentStep - 1 : currentStep
            const active = currentWizardStep === i
            const stepActive = i >= 2 ? i + 1 : i
            const passed = i < currentWizardStep || i < onboardingStep
            const stepFailed = failed && onboardingStep === stepActive
            const finish = active && !stepFailed && i === 4

            return (
              <Item key={ `headerItem_${i}` }>
                { i > 0 && <Separator passed={ i <= currentWizardStep } /> }
                <Step>
                  <Circle
                    onClick={ passed ? onClick(stepActive) : undefined }
                    active={ active }
                    passed={ passed }
                  >
                    { !finish && !stepFailed && i + 1 }
                    { stepFailed && <IconErrorOutline color="#f00" /> }
                    { finish && <IconSuccessOutline color="#6bc11a" /> }
                  </Circle>
                  <Label active={ active }>{ stepFailed ? 'Session failed' : label }</Label>
                </Step>
              </Item>)
          }) }
        </Wrapper>
        <MobileLabel>{ steps[currentStep >= 2 ? currentStep - 1 : currentStep] }</MobileLabel>
      </Fragment>
    )
  }
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0;
`

const Item = styled.div`
  display: flex;
`

const Step = styled.div`
  text-align: center;
`

const Circle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #fff;
  margin: 0 auto;
  font-size: 20px;
  color: #dae1e3;

  ${props => props.passed && css`
    background: #d2dadc;
    color: #8794a0;
    cursor: pointer;

    &:hover {
      background: #f6b530;
      color: #000;
    }
  `}

  ${props => props.active && css`
    border: 2px solid #f6b530;
    background: #fff;
    color: #000;
  `}

  ${media.phoneLarge`
    width: 40px;
    height: 40px;
    line-height: 40px;
  `}
`

const Label = styled.div`
  width: 120px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #aeaeae;

  ${props => props.active && css`
    color: #000;
  `}

  ${media.phoneLarge`
    display: none;
  `}
`

const Separator = styled.div`
  width: 100px;
  height: 1px;
  background: #dadada;
  position: relative;
  margin: 25px -25px 0;

  ${props => props.passed && css`
    background: #74818f;
  `}

  ${media.tablet`
    width: 80px;
  `}

  ${media.phoneLarge`
    width: 10px;
    margin: 20px 5px 0;
  `}
`

const MobileLabel = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;
  color: #000;
  
  ${media.phoneLarge`
    display: flex;
  `}
`

export default Header
