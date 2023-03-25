import React from 'react'
import styled from 'styled-components'

import { Button } from 'components/Button'
import { Logo, LogoWhiteBg } from 'components/Logo'
import { media, sizes } from 'components/Media'
import { Form, TextField, PhoneField } from 'components/form'
import { Checkbox } from 'components/Checkbox'
import { PhoneLarge, DesktopMedium } from 'components/MediaQuery'

import londonBg1024 from 'assets/images/london-bg_1024х240.jpg'

class SignUpForm extends Form {
  state = {
    agree: false
  }

  validations = {
    lastName: ['presence', 'personName'],
    firstName: ['presence', 'personName'],
    email: ['presence', 'email'],
    phone: ['presence', 'phone'],
    licenseNumber: 'presence'
  }

  onSelect = () => {
    this.setState(state => ({
      agree: !state.agree
    }))
  }

  save = this.save.bind(this)

  $render($) {
    const { agree } = this.state
    return (
      <Wrapper>
        <DesktopMedium>
          <StyledLogo width={ 85 } height={ 40 } />
          <Title>Sign Up</Title>
        </DesktopMedium>
        <PhoneLarge maxWidth={ sizes.desktopSmall } minWidth={ 0 }>
          <PhoneLargeBlock>
            <StyledLogoWhiteBg width={ 85 } height={ 40 } />
            <Line />
            <PhoneLargeTitle>
              WELCOME TO GETT
            </PhoneLargeTitle>
            <PhoneLargeTitle2>
              Register today and start earning more on every journey.
            </PhoneLargeTitle2>
          </PhoneLargeBlock>
        </PhoneLarge>
        <TextFieldStyled { ...$('firstName') } label="First name" placeholder="Start typing" required />
        <TextFieldStyled { ...$('lastName') } label="Last name" placeholder="Start typing" required />
        <TextFieldStyled { ...$('email') } label="Email " placeholder="Start typing" required />
        <PhoneFieldStyled { ...$('phone') } label="Phone" placeholder="123456789" required />
        <TextFieldStyled { ...$('licenseNumber') } label="TFL Private Hire driver license number (PHDL)" placeholder="Start typing" required />
        <TextFieldStyled { ...$('howDidYouHearAbout') } label="How did you hear about Gett?" placeholder="Start typing" />
        <AgreeCheckbox>
          <Checkbox
            checked={ agree }
            onClick={ this.onSelect }
          />
          <Text>
            I agree to Gett's
            <StyledLink href="/auth/privacy" target="_blank">Privacy Policy</StyledLink>
          </Text>
        </AgreeCheckbox>
        <SubmitHolder><Submit onClick={ this.save } disabled={ !agree }>Submit</Submit></SubmitHolder>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  width: 300px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  ${media.desktopSmall`
    width: 100%;
  `}
`

const PhoneLargeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 240px;
  margin-bottom: 30px;
  padding: 10px;
  
  background: url('${londonBg1024}') no-repeat center/cover;
`

const Line = styled.div`
  height: 1px;
  width: 260px;
  opacity: 0.5;
  background-color: #fff;
  margin-bottom: 25px;
`

const PhoneLargeTitle = styled.div`
  font-size: 24px;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
`

const PhoneLargeTitle2 = styled.div`
  font-size: 18px;
  color: #fff;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
`

const Title = styled.div`
  color: #303030;
  text-align: center;
  font-size: 36px;
  margin-bottom: 50px;
  
  ${media.tablet`
    margin-bottom: 20px;  
  `}
`

const TextFieldStyled = styled(TextField)`
  margin-bottom: 20px;
  
  ${media.desktopSmall`
    width: 300px;
    align-self: center;
  `}
`
const PhoneFieldStyled = styled(PhoneField)`
  margin-bottom: 20px;
  
  ${media.desktopSmall`
    width: 300px;
    align-self: center;
  `}
`

const AgreeCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  font-size: 14px;
  
  ${media.desktopSmall`
    width: 300px;
    align-self: center;
    align-items: flex-start;
  `}
`

const StyledLink = styled.a`
  color: #f6b530;
  font-weight: bold;
  margin-left: 5px;
`

const Text = styled.div`
  margin-left: 10px;
`

const SubmitHolder = styled.div`
  padding-bottom: 20px;
`

const Submit = styled(Button)`
  align-self: center;
`

const StyledLogo = styled(Logo)`
  margin: 20px 0 40px 0;
  display: block;
`

const StyledLogoWhiteBg = styled(LogoWhiteBg)`
  margin-bottom: 25px;
`

export default SignUpForm
