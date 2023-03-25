import React from 'react'

const IconJustifyFull = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="justify_align_20x20-a" d="M1,19 L19,19 L19,17 L1,17 L1,19 L1,19 Z M1,15 L19,15 L19,13 L1,13 L1,15 L1,15 Z M1,11 L19,11 L19,9 L1,9 L1,11 L1,11 Z M1,7 L19,7 L19,5 L1,5 L1,7 L1,7 Z M1,1 L1,3 L19,3 L19,1 L1,1 L1,1 Z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={ color } xlinkHref="#justify_align_20x20-a" />
      </g>
    </svg>
  )
}

IconJustifyFull.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconJustifyFull
