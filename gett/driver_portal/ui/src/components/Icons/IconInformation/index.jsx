import React from 'react'

const IconInformation = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <desc>Created with Sketch.</desc>
      <defs />
      <g id="information" stroke="none" strokeWidth={ 1 } fill="none" fillRule="evenodd">
        <circle id="Oval" fill={ color } cx={ 10 } cy={ 10 } r={ 10 } />
        <rect id="Rectangle" fill="#FFFFFF" transform="translate(10.000000, 11.500000) rotate(-180.000000) translate(-10.000000, -11.500000) " x={ 9 } y={ 7 } width={ 2 } height={ 9 } rx={ 1 } />
        <rect id="Rectangle-Copy" fill="#FFFFFF" transform="translate(10.000000, 5.000000) rotate(-180.000000) translate(-10.000000, -5.000000) " x={ 9 } y={ 4 } width={ 2 } height={ 2 } rx={ 1 } />
      </g>
    </svg>
  )
}

IconInformation.defaultProps = {
  width: 20,
  height: 20,
  color: '#4373D7'
}

export default IconInformation
