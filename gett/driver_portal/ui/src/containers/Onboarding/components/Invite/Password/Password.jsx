import React from 'react'
import styled from 'styled-components'
import { breakpoints } from 'components/Media'
import { TextField } from 'components/TextField'
import { IconPassword } from 'components/Icons'
import { PasswordComplexity } from 'components/PasswordComplexity'

const Password = ({ invite, errors, attrs, onUpdate }) => (
  <Wrapper>
    <Icon color="#f6b530" width={ 66 } height={ 80 } />
    <TextField
      label="Password"
      type="password"
      value={ attrs.password || '' }
      onChange={ value => onUpdate({ password: value }) }
      errors={ errors.password }
    />
    <TextField
      label="Password Confirmation"
      type="password"
      value={ attrs.passwordConfirmation || '' }
      onChange={ value => onUpdate({ passwordConfirmation: value }) }
      errors={ errors.passwordConfirmation }
    />
    <PasswordComplexity value={ attrs.password || '' } />
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Icon = styled(IconPassword)`
  margin: 20px auto 0px auto;

  ${breakpoints.phoneLarge`
    margin: 80px auto 20px auto;
  `}

  ${breakpoints.tablet`
    margin: 40px auto 20px auto;
  `}

  ${breakpoints.desktopMedium`
    margin: 80px auto 70px auto;
  `}
`

export default Password
