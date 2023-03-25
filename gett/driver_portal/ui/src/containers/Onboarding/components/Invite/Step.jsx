import React from 'react'

import { DriverInfo } from './DriverInfo'
import { Password } from './Password'
import { Brief } from './Brief'

const Step = (props) => {
  const { invite } = props

  switch (invite.step) {
    case 'info':
      return <DriverInfo { ...props } />
    case 'password':
      return <Password { ...props } />
    case 'brief':
    case 'update':
      return <Brief { ...props } />
    default:
      return null
  }
}

export default Step
