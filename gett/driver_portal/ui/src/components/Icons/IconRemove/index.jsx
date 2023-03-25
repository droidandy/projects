import React from 'react'

const IconRemove = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <path fill={ color } d="M2.8,4.16666667 L2.88,4.16666667 L4.24,17.7916667 C4.4,19.0416667 5.4,20 6.64,20 L13.4,20 C14.6,20 15.64,19.0416667 15.8,17.7916667 L17.12,4.16666667 L17.2,4.16666667 C17.64,4.16666667 18,3.79166667 18,3.33333333 C18,2.875 17.64,2.5 17.2,2.5 L16.4,2.5 L14.8,2.5 L14.8,2.45833333 C14.8,1.08333333 13.72,0 12.4,0 L7.6,0 C6.28,0 5.2,1.08333333 5.2,2.5 L3.6,2.5 L2.8,2.5 C2.36,2.5 2,2.875 2,3.33333333 C2,3.79166667 2.36,4.16666667 2.8,4.16666667 Z M6.8,2.45833333 C6.8,2 7.16,1.66666667 7.6,1.66666667 L12.4,1.66666667 C12.84,1.66666667 13.2,2 13.2,2.5 L6.8,2.45833333 Z M15.52,4.16666667 L14.2,17.5833333 C14.16,18 13.8,18.3333333 13.4,18.3333333 L6.6,18.3333333 C6.2,18.3333333 5.84,18 5.8,17.625 L4.48,4.16666667 L15.52,4.16666667 Z M8.4,16.6666667 C8.84,16.6666667 9.2,16.2916667 9.2,15.8333333 L9.2,6.66666667 C9.2,6.20833333 8.84,5.83333333 8.4,5.83333333 C7.96,5.83333333 7.6,6.20833333 7.6,6.66666667 L7.6,15.8333333 C7.6,16.2916667 7.96,16.6666667 8.4,16.6666667 Z M11.6,16.6666667 C12.04,16.6666667 12.4,16.2916667 12.4,15.8333333 L12.4,6.66666667 C12.4,6.20833333 12.04,5.83333333 11.6,5.83333333 C11.16,5.83333333 10.8,6.20833333 10.8,6.66666667 L10.8,15.8333333 C10.8,16.2916667 11.16,16.6666667 11.6,16.6666667 Z" />
    </svg>
  )
}

IconRemove.defaultProps = {
  width: 20,
  height: 20,
  color: '#a9b1ba'
}

export default IconRemove
