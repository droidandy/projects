import React from 'react'
import MediaQuery from 'react-responsive'
import { sizes } from 'components/Media'

export default function DesktopLarge(props) {
  return <MediaQuery { ...props } minWidth={ sizes.desktopMedium + 1 } />
}
