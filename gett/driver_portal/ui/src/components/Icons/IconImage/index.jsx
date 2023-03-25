import React from 'react'

const IconImage = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="image_20x20-a" d="M19,17 L19,3 C19,1.9 18.1,1 17,1 L3,1 C1.9,1 1,1.9 1,3 L1,17 C1,18.1 1.9,19 3,19 L17,19 C18.1,19 19,18.1 19,17 L19,17 Z M6.5,11.5 L9,14.51 L12.5,10 L17,16 L3,16 L6.5,11.5 L6.5,11.5 Z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={ color } xlinkHref="#image_20x20-a" />
      </g>
    </svg>
  )
}

IconImage.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconImage
