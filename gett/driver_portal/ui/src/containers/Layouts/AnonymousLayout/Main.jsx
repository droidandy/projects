import React from 'react'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
import { media, sizes } from 'components/Media'
import { PhoneSmall } from 'components/MediaQuery'
import { StaticPagesLinks } from './StaticPagesLinks'
import { Logo } from 'components/Logo'

const Main = ({ children }) => (
  <Wrapper>
    <Container>
      <LoginContainer>
        <MediaQuery minWidth={ sizes.desktopMedium + 1 }>
          <Logo width={ 190.6 } height={ 90 } />
        </MediaQuery>
        <MediaQuery minWidth={ sizes.phoneSmall + 1 } maxWidth={ sizes.desktopMedium }>
          <Logo />
        </MediaQuery>
        <PhoneSmall>
          <Logo width={ 106 } height={ 50 } />
        </PhoneSmall>
        <LogoText>
          Driver Portal
        </LogoText>
        { children }
      </LoginContainer>

      <StaticPagesLinks />
    </Container>
  </Wrapper>
)

const Wrapper = styled.div`
  height: 100%;
  width: 720px;

  ${media.desktopMedium`width: 440px;`}
  ${media.desktopSmall`width: 440px;`}
  ${media.tablet`width: 380px`}
  ${media.phoneLarge`width: 768px;`}
  ${media.phoneSmall`width: 320px; height: auto;`}
`

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1 0;
`

const Container = styled.div`
  height: 100%;
  min-height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-bottom: 50px;
  
  ${media.phoneLarge`min-height: 500px;`}
`

const LogoText = styled.div`
  margin: 0 auto;
  margin-top: 18px;
  width: 148px;
  height: 32px;
  font-family: Roboto;
  font-size: 20px;
  letter-spacing: 1.2px;
  color: #a8a8b5;
  text-align: center;

  ${media.phoneSmall`margin-top: 8px;`}
`

export default Main
