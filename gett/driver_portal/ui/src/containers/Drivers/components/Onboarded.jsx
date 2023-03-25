import React from 'react'
import styled from 'styled-components'
import { DateTime } from 'components/DateTime'
import { IconTime } from 'components/Icons'

const Onboarded = ({ user }) => {
  if (user.invite) {
    if (user.invite.step === 'accepted') {
      return (
        <DateTime value={ user.invite.acceptedAt } />
      )
    }

    return (
      <Wrapper>
        <Status>
          <DateTime value={ user.invite.createdAt } />
          <Pending>pending onboarding</Pending>
        </Status>
        <Icon color="#f6b530" />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Status>
        <DateTime value={ user.createdAt } />
        <Pending>pending invitation</Pending>
      </Status>
      <Icon color="#f6b530" />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Status = styled.div`
  display: flex;
  flex-direction: column;
`

const Pending = styled.div`
  font-size: 12px;
  color: #a9b1ba;
  margin-top: 5px;
`

const Icon = styled(IconTime)`
  margin-left: 10px;
`

export default Onboarded
