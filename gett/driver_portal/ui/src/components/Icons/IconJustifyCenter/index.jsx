import React from 'react'

const IconJustifyCenter = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="left_align_20x20-copy-a" d="M5,13 L5,15 L15,15 L15,13 L5,13 L5,13 Z M1,19 L19,19 L19,17 L1,17 L1,19 L1,19 Z M1,11 L19,11 L19,9 L1,9 L1,11 L1,11 Z M5,5 L5,7 L15,7 L15,5 L5,5 L5,5 Z M1,1 L1,3 L19,3 L19,1 L1,1 L1,1 Z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={ color } xlinkHref="#left_align_20x20-copy-a" />
      </g>
    </svg>
  )
}

IconJustifyCenter.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconJustifyCenter
