import React from 'react'

const IconActivate = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <path fill={ color } fillRule="evenodd" d="M6,4 L14,4 C17.3137085,4 20,6.6862915 20,10 L20,10 C20,13.3137085 17.3137085,16 14,16 L6,16 C2.6862915,16 4.05812251e-16,13.3137085 0,10 L0,10 C-4.05812251e-16,6.6862915 2.6862915,4 6,4 Z M14.5,6.57142857 L14.5,6.57142857 C16.4329966,6.57142857 18,8.13843195 18,10.0714286 L18,10.0714286 C18,12.0044252 16.4329966,13.5714286 14.5,13.5714286 L14.5,13.5714286 C12.5670034,13.5714286 11,12.0044252 11,10.0714286 L11,10.0714286 C11,8.13843195 12.5670034,6.57142857 14.5,6.57142857 Z" />
    </svg>
  )
}

IconActivate.defaultProps = {
  width: 20,
  height: 20,
  color: '#A9B1BA'
}

export default IconActivate
