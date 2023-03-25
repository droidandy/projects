import React from 'react'

const IconBold = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="bold_font_20x20-a" d="M13,9.79 C13.9023256,9.12 14.5348837,8.02 14.5348837,7 C14.5348837,4.74 12.9069767,3 10.8139535,3 L5,3 L5,17 L11.5488372,17 C13.4930233,17 15,15.3 15,13.21 C15,11.69 14.2,10.39 13,9.79 L13,9.79 Z M7.79069767,5.5 L10.5813953,5.5 C11.3534884,5.5 11.9767442,6.17 11.9767442,7 C11.9767442,7.83 11.3534884,8.5 10.5813953,8.5 L7.79069767,8.5 L7.79069767,5.5 L7.79069767,5.5 Z M11.0465116,14.5 L7.79069767,14.5 L7.79069767,11.5 L11.0465116,11.5 C11.8186047,11.5 12.4418605,12.17 12.4418605,13 C12.4418605,13.83 11.8186047,14.5 11.0465116,14.5 L11.0465116,14.5 Z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={ color } xlinkHref="#bold_font_20x20-a" />
      </g>
    </svg>
  )
}

IconBold.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconBold
