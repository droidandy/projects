import React from 'react'
import MediaQuery from 'react-responsive'
import { sizes } from 'components/Media'

export default function PhoneMedium(props) {
  return <MediaQuery maxWidth={ sizes.phoneSmall + 1 } minWidth={ sizes.phoneSmall + 1 } { ...props } />
}
