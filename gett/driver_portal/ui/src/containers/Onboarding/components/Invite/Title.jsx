import React from 'react'
import styled from 'styled-components'
import { isEmpty, join } from 'lodash'

const Title = ({ invite, errors }) => {
  let text

  switch (invite.step) {
    case 'info':
      text = 'Check Your Personal Information'
      break
    case 'password':
      text = 'Create Your Password'
      break
    case 'brief':
    case 'update':
      text = 'Welcome to the new Gett Driver Portal! Here you can:'
      break
    default:
      if (!isEmpty(errors.token)) {
        text = join(errors.token, '.')
      } else {
        text = 'Invalid invite state detected'
      }
      break
  }

  return (
    <Wrapper>{ text }</Wrapper>
  )
}

const Wrapper = styled.h1`
  width: 100%;
  font-size: 24px;
  text-align: center;
  color: #303030;
  font-weight: 400;
  margin: 0;
`

export default Title
