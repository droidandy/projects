import React from 'react'

const IconMissing = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <path fill={ color } d="M10,18.3 C14.5839634,18.3 18.3,14.5839634 18.3,10 C18.3,5.41603658 14.5839634,1.7 10,1.7 C5.41603658,1.7 1.7,5.41603658 1.7,10 C1.7,14.5839634 5.41603658,18.3 10,18.3 Z M10,20 C4.4771525,20 0,15.5228475 0,10 C0,4.4771525 4.4771525,0 10,0 C15.5228475,0 20,4.4771525 20,10 C20,15.5228475 15.5228475,20 10,20 Z" />
    </svg>
  )
}

IconMissing.defaultProps = {
  width: 20,
  height: 20,
  color: '#D2DADC'
}

export default IconMissing
