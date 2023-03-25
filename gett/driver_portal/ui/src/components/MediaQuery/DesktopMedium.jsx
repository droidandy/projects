import React from 'react'
import MediaQuery from 'react-responsive'
import { sizes } from 'components/Media'

export default function DesktopMedium(props) {
  return <MediaQuery { ...props } minWidth={ sizes.desktopSmall + 1 } />
}
