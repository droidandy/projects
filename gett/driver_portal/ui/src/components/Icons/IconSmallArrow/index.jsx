import React from 'react'

const IconSmallArrow = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <polygon fill={ color } points="10 12 14 8 6 8" />
    </svg>
  )
}

IconSmallArrow.defaultProps = {
  width: 20,
  height: 20,
  color: '#282c37'
}

export default IconSmallArrow
