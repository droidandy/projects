import React from 'react'

const IconJustifyRight = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="right_align_20x20-a" d="M13,13 L1,13 L1,15 L13,15 L13,13 L13,13 Z M13,5 L1,5 L1,7 L13,7 L13,5 L13,5 Z M1,11 L19,11 L19,9 L1,9 L1,11 L1,11 Z M1,19 L19,19 L19,17 L1,17 L1,19 L1,19 Z M1,1 L1,3 L19,3 L19,1 L1,1 L1,1 Z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={ color } transform="matrix(-1 0 0 1 20 0)" xlinkHref="#right_align_20x20-a" />
      </g>
    </svg>
  )
}

IconJustifyRight.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconJustifyRight
