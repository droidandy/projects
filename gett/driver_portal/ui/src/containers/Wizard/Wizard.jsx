import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { FrontOfficeLayout } from 'containers/Layouts'
import { media } from 'components/Media'

import { Header, Stepper } from './components'

import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

class Wizard extends Component {
  state = {
    currentStep: 0,
    failed: false
  }

  componentDidMount() {
    const { match: { params: { page } }, currentUser: { onboardingFailedAt } } = this.props
    this.redirectToStep(this.props)
    if (onboardingFailedAt) {
      this.setState({ failed: true, currentStep: ~~page })
    } else {
      this.setState({ currentStep: ~~page })
    }
  }

  componentWillReceiveProps(newProps) {
    const { match: { params: { page } }, currentUser: { onboardingFailedAt } } = newProps
    const { currentStep } = this.state

    if (currentStep !== ~~page) {
      this.setState({ currentStep: ~~page })
    } else if (onboardingFailedAt &&
      this.props.currentUser.onboardingFailedAt !== onboardingFailedAt) {
      this.setState({ failed: true })
    } else {
      this.redirectToStep(newProps)
    }
  }

  render() {
    const { currentUser, logout, history, setVehicle, errors, showLayoutScroll, hideLayoutScroll } = this.props
    const { currentStep, failed } = this.state

    return (
      <div>
        <FrontOfficeLayout
          currentUser={ currentUser }
          logout={ logout }
          location={ history.location }
          setVehicle={ setVehicle }
        >
          <Header
            currentStep={ currentStep }
            currentUser={ currentUser }
            onClick={ this.header }
            failed={ failed }
          />
          <Container>
            <Stepper
              onRequestSave={ this.save }
              history={ history }
              currentUser={ currentUser }
              currentStep={ currentStep }
              userCurrentStep={ currentUser.onboardingStep }
              failed={ failed }
              onTryAgain={ this.tryAgain }
              errors={ errors }
              showLayoutScroll={ showLayoutScroll }
              hideLayoutScroll={ hideLayoutScroll }
            />
          </Container>
        </FrontOfficeLayout>
      </div>
    )
  }

  save = (user, step) => {
    const { history, save, currentUser: { onboardingFailedAt, onboardingStep } } = this.props
    if (step === 3 && onboardingFailedAt && onboardingStep === 5) step = 4
    if (step === 0 && onboardingFailedAt && onboardingStep === 1) {
      this.setState({
        failed: true
      })
    }
    user = { ...user, onboardingStep: step }
    save({ user, history, step })
  }

  header = (step) => (e) => {
    this.startNewAttempt(step)
  }

  tryAgain = () => {
    const step = this.props.currentUser.onboardingStep === 5 ? 3 : this.state.currentStep
    this.startNewAttempt(step)
  }

  redirectToStep = (props) => {
    const { currentUser: { onboardingStep }, match: { params: { page } }, history: { push } } = props
    if (page > onboardingStep) push(`/wizard/${onboardingStep}`)
    if (!page) push(`/wizard/${onboardingStep}`)
  }

  startNewAttempt = (step) => {
    this.setState({
      failed: false
    }, () => this.props.history.push(`/wizard/${step}`))
  }
}

const Container = styled.div`
  position: relative;
  width: 100%;
  padding:0 30px;
  margin-top: 30px;
  background: #f4f4f4;

  ${media.phoneMedium`
    padding: 0;
  `}
`

export default connect(mapStateToProps, mapDispatchToProps)(Wizard)
