import React from 'react'
import MediaQuery from 'react-responsive'
import { sizes } from 'components/Media'

export default function DesktopMediumLarge(props) {
  return <MediaQuery { ...props } minWidth={ sizes.desktopMediumLarge + 1 } />
}
