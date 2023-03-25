import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { media } from 'components/Media'
import { SignUp, Info, Info2, Documents, Appointment, WelcomeSession } from './Steps'
import Failed from './Failed'

class Stepper extends PureComponent {
  renderStep() {
    const { currentStep, failed, userCurrentStep } = this.props
    if (failed) return <Failed { ...this.props } />
    switch (currentStep) {
      case 0:
        return <SignUp { ...this.props } />
      case 1:
        return <Info { ...this.props } />
      case 2:
        return userCurrentStep > 1 && <Info2 { ...this.props } />
      case 3:
        return <Appointment { ...this.props } />
      case 4:
        return <Documents { ...this.props } />
      case 5:
        return <WelcomeSession { ...this.props } />
      default:
        return <Failed { ...this.props } />
    }
  }

  render() {
    return (
      <Wrapper>
        { this.renderStep() }
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  ${media.phoneLarge`
    padding-bottom: 40px;
  `}
`

export default Stepper
