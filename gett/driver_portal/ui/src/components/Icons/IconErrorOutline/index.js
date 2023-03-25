import React from 'react'

const Icon = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <path fill={ color } d="M10,20 C4.47826087,20 0,15.5217391 0,10 C0,4.47826087 4.47826087,0 10,0 C15.5217391,0 20,4.47826087 20,10 C20,15.5217391 15.5217391,20 10,20 Z M10,1.73913043 C5.43478261,1.73913043 1.73913043,5.43478261 1.73913043,10 C1.73913043,14.5652174 5.43478261,18.2608696 10,18.2608696 C14.5652174,18.2608696 18.2608696,14.5652174 18.2608696,10 C18.2608696,5.43478261 14.5652174,1.73913043 10,1.73913043 Z M12.7628559,11.598635 C13.079048,11.9258269 13.079048,12.438214 12.7628559,12.7544061 C12.4466638,13.081598 11.9232769,13.081598 11.6070848,12.7544061 L10.0041249,11.1516462 L8.40116497,12.7546061 C8.08497288,13.081798 7.56158596,13.081798 7.24539387,12.7546061 C6.91820204,12.438414 6.91820204,11.9258269 7.24539387,11.598835 L8.84835379,9.9958751 L7.24539387,8.39291518 C6.91820204,8.07672308 6.91820204,7.5641359 7.24539387,7.23714407 C7.56158596,6.92095198 8.08497288,6.92095198 8.40116497,7.23714407 L10.0041249,8.840104 L11.6070848,7.23714407 C11.9232769,6.92095198 12.4466638,6.92095198 12.7628559,7.23714407 C13.079048,7.56433589 13.079048,8.07672308 12.7628559,8.39291518 L11.159896,9.9958751 L12.7628559,11.598635 Z" />
    </svg>
  )
}

Icon.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default Icon
