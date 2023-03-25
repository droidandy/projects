import React from 'react'
import styled from 'styled-components'
import { breakpoints } from 'components/Media'
import { Button } from 'components/Button'
import { IconArrow } from 'components/Icons'

const NextButton = ({ invite, errors, onClick }) => {
  if (errors.token) {
    return null
  }

  return (
    <Wrapper>
      <Next onClick={ onClick }>
        <Text>
          { invite.step === 'brief' || invite.step === 'update' ? 'Start' : 'Next'}
        </Text>
        { invite.step !== 'brief' && invite.step !== 'update' && <Icon color="#000" /> }
      </Next>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  ${breakpoints.phoneLarge`
    margin-top: 60px;
  `}

  ${breakpoints.desktopSmall`
    margin-top: 50px;
  `}
`

const Next = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Text = styled.div`
  font-size: 16px;
  color: #000000;
`

const Icon = styled(IconArrow)`
  transform: rotate(180deg);
  margin-left: 16px;
`

export default NextButton
