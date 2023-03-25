import React from 'react'
import Responsive from 'react-responsive'
import { isEmpty } from 'lodash'

const MediaQuery = ({ minWidth, maxWidth, className, children }) => {
  const mediaProps = {}

  if (minWidth) {
    mediaProps.minWidth = minWidth
  }

  if (maxWidth) {
    mediaProps.maxWidth = maxWidth
  }

  if (isEmpty(mediaProps)) {
    return children
  }

  return (
    <Responsive className={ className } { ...mediaProps }>
      { children }
    </Responsive>
  )
}

export default MediaQuery
