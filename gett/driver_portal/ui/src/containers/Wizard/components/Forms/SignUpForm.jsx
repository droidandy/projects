import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { Button } from 'components/Button'
import { Logo } from 'components/Logo'
import { media, breakpoints } from 'components/Media'
import { Form, TextField, PhoneField } from 'components/form'
import { Checkbox } from 'components/Checkbox'

class SignUpForm extends Form {
  state = {
    agree: false
  }

  validations = {
    lastName: ['presence', 'personName'],
    firstName: ['presence', 'personName'],
    email: 'email',
    phone: ['presence', 'phone']
  }

  onSelect = () => {
    this.setState(state => ({
      agree: !state.agree
    }))
  }

  save = this.save.bind(this)

  $render($) {
    const { logo, title, className } = this.props
    const { agree } = this.state
    return (
      <Wrapper className={ className }>
        { logo && <StyledLogo width={ 85 } height={ 40 } /> }
        { title && <Title>Sign Up</Title> }
        <Fields>
          <TextFieldStyled { ...$('firstName') } label="First name" placeholder="Start typing" required />
          <TextFieldStyled { ...$('lastName') } label="Last name" placeholder="Start typing" required />
          <TextFieldStyled { ...$('email') } label="Email " placeholder="Start typing" required />
          <PhoneFieldStyled { ...$('phone') } label="Phone" placeholder="123456789" required />
          <TextFieldStyled { ...$('licenseNumber') } label="TFL Private Hire driver license number (PHDL)" placeholder="Start typing" required />
          <TextFieldStyled { ...$('howDidYouHearAbout') } label="How did you hear about Gett?" placeholder="Start typing" />
        </Fields>
        <AgreeCheckbox>
          <Checkbox
            checked={ agree }
            onClick={ this.onSelect }
          />
          <Text>
            I agree to Gett's
            <StyledLink to="/auth/privacy">Privacy Policy</StyledLink>
          </Text>
        </AgreeCheckbox>
        <Submit onClick={ this.save } disabled={ !agree }>Save Changes</Submit>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  ${media.phoneLarge`
    background-color: #fff;
    margin-bottom: 30px;
    width: 90%;
    padding-top: 30px;
  `}
`

const Fields = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  ${media.phoneLarge`
    flex-direction: column;
    justify-content: center;
  `}
`

const Title = styled.div`
  color: #303030;
  text-align: center;
  font-size: 36px;
  margin-bottom: 50px;
`

const TextFieldStyled = styled(TextField)`
  width: 300px;
  margin-bottom: 20px;
  ${media.phoneLarge`
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
  `}
`

const PhoneFieldStyled = styled(PhoneField)`
  width: 300px;
  margin-bottom: 20px;
  ${media.phoneLarge`
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
  `}
`

const AgreeCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  font-size: 14px;
`

const StyledLink = styled(NavLink)`
  color: #f6b530;
  font-weight: bold;
  margin-left: 5px;
`

const Text = styled.div`
  margin-left: 10px;
`

const Submit = styled(Button)`
  align-self: center;
  ${breakpoints.phoneLarge`
    margin: 100px 0 30px 0;
  `}
  ${breakpoints.phoneSmall`
    margin-bottom: 30px;
  `}
`

const StyledLogo = styled(Logo)`
  margin-bottom: 40px;
  display: none;
  ${media.tablet`
    display: block;
  `}
`

export default SignUpForm
