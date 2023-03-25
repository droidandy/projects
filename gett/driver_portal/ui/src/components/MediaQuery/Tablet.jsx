import React from 'react'
import MediaQuery from 'react-responsive'
import { sizes } from 'components/Media'

export default function Tablet(props) {
  return <MediaQuery maxWidth={ sizes.tablet } minWidth={ sizes.phoneSmall + 1 } { ...props } />
}
