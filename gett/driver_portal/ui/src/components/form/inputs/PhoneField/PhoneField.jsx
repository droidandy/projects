import React from 'react'
import styled from 'styled-components'

import { TextField } from '../TextField'

const PHONE_PREFIX = '07'

const PhoneField = (props) => {
  const { placeholder } = props
  return (
    <TextField
      prefix={ <PhonePrefix>{ PHONE_PREFIX }</PhonePrefix> }
      placeholder={ placeholder || '123456789' }
      { ...props }
    />
  )
}

const PhonePrefix = styled.div`
    position: absolute;
    width: 40px;
    height: 40px;
    top: -3px;
    left: -16px;
    line-height: 40px;
    border-right: 1px solid #a8a8b5;
    text-align: center;
    font-size: 14px;
`

export default PhoneField
