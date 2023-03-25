import React from 'react'

const IconNumberList = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="number_list_20x20-a" d="M1,15 L3,15 L3,15.5 L2,15.5 L2,16.5 L3,16.5 L3,17 L1,17 L1,18 L4,18 L4,14 L1,14 L1,15 L1,15 Z M2,6 L3,6 L3,2 L1,2 L1,3 L2,3 L2,6 L2,6 Z M1,9 L2.8,9 L1,11.1 L1,12 L4,12 L4,11 L2.2,11 L4,8.9 L4,8 L1,8 L1,9 L1,9 Z M6,3 L6,5 L19,5 L19,3 L6,3 L6,3 Z M6,17 L19,17 L19,15 L6,15 L6,17 L6,17 Z M6,11 L19,11 L19,9 L6,9 L6,11 L6,11 Z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={ color } xlinkHref="#number_list_20x20-a" />
      </g>
    </svg>
  )
}

IconNumberList.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconNumberList
