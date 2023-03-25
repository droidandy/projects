import React from 'react'
import MediaQuery from 'react-responsive'
import { sizes } from 'components/Media'

export default function DesktopTablet(props) {
  return <MediaQuery { ...props } maxWidth={ sizes.tablet } minWidth={ sizes.phoneLarge + 1 } />
}
