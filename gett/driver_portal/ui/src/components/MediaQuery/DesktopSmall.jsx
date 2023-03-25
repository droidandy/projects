import React from 'react'
import MediaQuery from 'react-responsive'
import { sizes } from 'components/Media'

export default function DesktopSmall(props) {
  return <MediaQuery { ...props } minWidth={ sizes.phoneLarge + 1 } maxWidth={ sizes.desktopSmall } />
}
