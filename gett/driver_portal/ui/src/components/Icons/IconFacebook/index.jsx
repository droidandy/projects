import React from 'react'

const IconFacebook = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 34 34" width={ width } height={ height } className={ className }>
      <path fill={ color } fillRule="evenodd" d="M17 34C7.611 34 0 26.389 0 17S7.611 0 17 0s17 7.611 17 17-7.611 17-17 17zm-2.47-8.5h3.424v-8.572h2.389l.254-2.87h-2.643v-1.635c0-.677.136-.944.79-.944h1.853V8.5h-2.37c-2.548 0-3.696 1.122-3.696 3.27v2.287H12.75v2.907h1.78V25.5z" />
    </svg>
  )
}

IconFacebook.defaultProps = {
  width: 34,
  height: 34,
  color: '#A8A8B5'
}

export default IconFacebook
