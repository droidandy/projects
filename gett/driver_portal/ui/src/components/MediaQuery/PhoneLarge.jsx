import React from 'react'
import MediaQuery from 'react-responsive'
import { sizes } from 'components/Media'

export default function PhoneLarge(props) {
  return <MediaQuery maxWidth={ sizes.phoneLarge + 1 } minWidth={ sizes.phoneSmall + 1 } { ...props } />
}
