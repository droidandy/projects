import React from 'react'

const IconTwitter = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 34 34" width={ width } height={ height } className={ className }>
      <path fill={ color } fillRule="evenodd" d="M17 34C7.611 34 0 26.389 0 17S7.611 0 17 0s17 7.611 17 17-7.611 17-17 17zM8 22.412A10.28 10.28 0 0 0 13.503 24c6.667 0 10.432-5.542 10.206-10.514a7.206 7.206 0 0 0 1.791-1.83 7.252 7.252 0 0 1-2.062.557 3.549 3.549 0 0 0 1.578-1.955c-.694.405-1.462.7-2.279.858A3.613 3.613 0 0 0 20.116 10c-2.317 0-4.02 2.129-3.497 4.34a10.244 10.244 0 0 1-7.4-3.693 3.505 3.505 0 0 0 1.11 4.719 3.614 3.614 0 0 1-1.626-.443c-.039 1.638 1.153 3.17 2.88 3.51a3.644 3.644 0 0 1-1.62.06 3.584 3.584 0 0 0 3.352 2.455A7.297 7.297 0 0 1 8 22.412z" />
    </svg>
  )
}

IconTwitter.defaultProps = {
  width: 34,
  height: 34,
  color: '#A8A8B5'
}

export default IconTwitter
