import React from 'react'
import MediaQuery from 'react-responsive'
import { sizes } from 'components/Media'

export default function PhoneSmall(props) {
  return <MediaQuery maxWidth={ sizes.phoneSmall } { ...props } />
}
