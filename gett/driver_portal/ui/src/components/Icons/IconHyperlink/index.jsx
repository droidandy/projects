import React from 'react'

const IconHyperlink = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="hyperlink_20x20-a" d="M1.9,10 C1.9,8.29 3.29,6.9 5,6.9 L9,6.9 L9,5 L5,5 C2.24,5 0,7.24 0,10 C0,12.76 2.24,15 5,15 L9,15 L9,13.1 L5,13.1 C3.29,13.1 1.9,11.71 1.9,10 L1.9,10 Z M6,11 L14,11 L14,9 L6,9 L6,11 L6,11 Z M15,5 L11,5 L11,6.9 L15,6.9 C16.71,6.9 18.1,8.29 18.1,10 C18.1,11.71 16.71,13.1 15,13.1 L11,13.1 L11,15 L15,15 C17.76,15 20,12.76 20,10 C20,7.24 17.76,5 15,5 L15,5 Z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={ color } xlinkHref="#hyperlink_20x20-a" />
      </g>
    </svg>
  )
}

IconHyperlink.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconHyperlink
