import React from 'react'
import MediaQuery from 'react-responsive'
import { sizes } from 'components/Media'

export default function Desktop(props) {
  return <MediaQuery minWidth={ sizes.phoneLarge + 1 } { ...props } />
}
