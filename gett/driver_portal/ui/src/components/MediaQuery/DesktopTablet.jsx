import React from 'react'
import MediaQuery from 'react-responsive'
import { sizes } from 'components/Media'

export default function DesktopTablet(props) {
  return <MediaQuery { ...props } minWidth={ sizes.tablet + 1 } />
}
