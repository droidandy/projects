import React from 'react'

const Icon = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 8 4" width={ width } height={ height } className={ className }>
      <polygon fill={ color } points="1328 175 1332 171 1324 171" transform="translate(-1324 -171)" />
    </svg>
  )
}

Icon.defaultProps = {
  width: 8,
  height: 4,
  color: '#74818F'
}

export default Icon
