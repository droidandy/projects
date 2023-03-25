import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { bindState } from 'components/form'

import { DesktopMedium } from 'components/MediaQuery'
import { media, breakpoints } from 'components/Media'
import { LogoWhiteBg } from 'components/Logo'
import londonBg1280 from 'assets/images/london_bg_1280.jpg'
import londonBg1440 from 'assets/images/london_bg_1440.jpg'
import londonBg1920 from 'assets/images/london_bg_1920.jpg'
import apolloCar1160 from 'assets/images/apollo_car_1160x460.png'

import { SignUpForm } from './components/SignUpForm'
import { Success } from './components/Success'

import { mapStateToProps } from './reducers'
import * as mapDispatchToProps from './actions'

class SignUp extends Component {
  state = {
    success: false
  }

  componentWillReceiveProps(nextProps) {
    const { user, errors } = nextProps
    if (user.success) {
      this.setState({
        success: true
      })
    }
    if (!isEmpty(errors)) {
      this.form.setErrors(errors)
    }
  }

  render() {
    const { success } = this.state
    return (
      <Wrapper>
        <DesktopMedium>
          <Wallpaper>
            <WelcomeBlock>
              <LogoHolder>
                <LogoWhiteBg />
              </LogoHolder>
              <Title>Welcome to Gett</Title>
              <Subtitle>Register today and start earning more on every journey.</Subtitle>
            </WelcomeBlock>
          </Wallpaper>
        </DesktopMedium>
        <Content>
          { success
            ? <Success />
            : <SignUpForm
              ref={ form => this.form = form }
              { ...bindState(this) }
              onRequestSave={ this.signUpUser }
            />
          }
        </Content>
        <DesktopMedium>
          <CarImage src={ apolloCar1160 } />
        </DesktopMedium>
      </Wrapper>
    )
  }

  signUpUser = (user) => {
    this.props.signUp({ user })
  }
}

const Wrapper = styled.div`
  position: relative;
  margin: 0;
  height: 100%;
  display: flex;
`

const Wallpaper = styled.div`
  position: relative;
  flex:1;
  background-color: #000;
  height: 100vh;
  background: url('${londonBg1920}') no-repeat center/cover;

  ${media.desktopMedium`
    background: url('${londonBg1440}') no-repeat center/cover;
  `}
  ${media.desktopSmall`
    background: url('${londonBg1280}') no-repeat center/cover;
  `}
`

const WelcomeBlock = styled.div`
  margin:60px 0 0 80px; 
`

const LogoHolder = styled.div`
  width: 260px;
  border-bottom: 1px solid #ffffff;
  padding-bottom: 30px;
  margin-bottom: 20px;
`

const Title = styled.div`
  font-size: 36px;
  color: #ffffff;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 10px;
`

const Subtitle = styled.div`
  font-size: 18px;
  color: #ffffff;
`

const Content = styled.div`
  flex: 1;
  ${breakpoints.desktopSmall`
    align-self: center;
  `}
`

const CarImage = styled.img`
  width: 60%;
  position: absolute;
  left: 50px;
  bottom: 0;
  left: 50px;
`

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
