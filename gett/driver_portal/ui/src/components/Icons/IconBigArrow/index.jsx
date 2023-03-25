import React from 'react'

const IconBigArrow = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="bigArrow-a" d="M10 13l6-6H4z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="bigArrow-b" fill="#fff">
          <use xlinkHref="#bigArrow-a" />
        </mask>
        <use fill="#000" fillRule="nonzero" xlinkHref="#bigArrow-a" />
        <g fill={ color } mask="url(#bigArrow-b)">
          <path d="M0 0h20v20H0z" />
        </g>
      </g>
    </svg>
  )
}

IconBigArrow.defaultProps = {
  width: 20,
  height: 20,
  color: '#d2dadc'
}

export default IconBigArrow
