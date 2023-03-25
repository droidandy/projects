import React from 'react'
import styled from 'styled-components'

import { media } from 'components/Media'
import { ButtonLink } from 'components/Button'
import CongularationsIcon from './CongularationsIcon'

const Success = () => {
  return (
    <Wrapper>
      <Title>Check your email</Title>
      <CongularationsIcon />
      <Text>Please, go to your inbox and click on the link in the email we have just sent you. You can continue setting up your account from there.</Text>
      <StyledButtonLink to="/auth">Got it</StyledButtonLink>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${media.phoneLarge`
    width: 300px;
  `}
`

const Title = styled.div`
  font-size: 36px;
  margin-bottom: 50px;
  ${media.phoneLarge`
    width: 250px;
  `}
`

const Text = styled.div`
  margin: 50px 0;
  color: #74818f;
`

const StyledButtonLink = styled(ButtonLink)`
  border: 1px solid #e1a62c;
  background: none;
`
export default Success
