import React from 'react'

const IconPending = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <g fill="none" fillRule="evenodd">
        <circle cx={ 10 } cy={ 10 } r={ 10 } fill={ color } />
        <path fill="#FFF" d="M13,10.5 C13.5522847,10.5 14,10.9477153 14,11.5 C14,12.0522847 13.5522847,12.5 13,12.5 L9.25,12.5 C8.69771525,12.5 8.25,12.0522847 8.25,11.5 C8.25,10.9477153 8.69771525,10.5 9.25,10.5 L13,10.5 Z" />
        <path fill="#FFF" d="M8.25,5.5 C8.25,4.94771525 8.69771525,4.5 9.25,4.5 C9.80228475,4.5 10.25,4.94771525 10.25,5.5 L10.25,11.5 C10.25,12.0522847 9.80228475,12.5 9.25,12.5 C8.69771525,12.5 8.25,12.0522847 8.25,11.5 L8.25,5.5 Z" />
      </g>
    </svg>
  )
}

IconPending.defaultProps = {
  width: 20,
  height: 20,
  color: '#F6B530'
}

export default IconPending
