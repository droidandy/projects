import React from 'react'

const IconItalic = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <polygon id="italic_font_20x20-a" points="8 3 8 6 10.21 6 6.79 14 4 14 4 17 12 17 12 14 9.79 14 13.21 6 16 6 16 3" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={ color } xlinkHref="#italic_font_20x20-a" />
      </g>
    </svg>
  )
}

IconItalic.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconItalic
