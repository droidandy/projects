import React from 'react'

const IconWriteComment = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="write_comment-a" d="M19.99,2 C19.99,0.9 19.1,0 18,0 L2,0 C0.9,0 0,0.9 0,2 L0,14 C0,15.1 0.9,16 2,16 L16,16 L20,20 L19.99,2 L19.99,2 Z M16,12 L4,12 L4,10 L16,10 L16,12 L16,12 Z M16,9 L4,9 L4,7 L16,7 L16,9 L16,9 Z M16,6 L4,6 L4,4 L16,4 L16,6 L16,6 Z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="write_comment-b" fill="#fff">
          <use xlinkHref="#write_comment-a" />
        </mask>
        <g fill={ color } mask="url(#write_comment-b)">
          <rect width={ 20 } height={ 20 } />
        </g>
      </g>
    </svg>
  )
}

IconWriteComment.defaultProps = {
  width: 20,
  height: 20,
  color: '#D2DADC'
}

export default IconWriteComment
