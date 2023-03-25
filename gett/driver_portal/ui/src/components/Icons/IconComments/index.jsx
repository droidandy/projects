import React from 'react'

const IconComments = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="comment-a" d="M19,4 L17,4 L17,13 L4,13 L4,15 C4,15.55 4.45,16 5,16 L16,16 L20,20 L20,5 C20,4.45 19.55,4 19,4 L19,4 Z M15,10 L15,1 C15,0.45 14.55,0 14,0 L1,0 C0.45,0 0,0.45 0,1 L0,15 L4,11 L14,11 C14.55,11 15,10.55 15,10 L15,10 Z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="comment-b" fill={ color }>
          <use xlinkHref="#comment-a" />
        </mask>
        <g fill={ color } mask="url(#comment-b)">
          <rect width={ width } height={ height } />
        </g>
      </g>
    </svg>
  )
}

IconComments.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconComments
