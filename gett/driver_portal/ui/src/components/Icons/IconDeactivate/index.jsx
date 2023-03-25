import React from 'react'

const IconDeactivate = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="deactivate-a" d="M6,5.5 C3.51471863,5.5 1.5,7.51471863 1.5,10 C1.5,12.4852814 3.51471863,14.5 6,14.5 L14,14.5 C16.4852814,14.5 18.5,12.4852814 18.5,10 C18.5,7.51471863 16.4852814,5.5 14,5.5 L6,5.5 Z M6,4 L14,4 C17.3137085,4 20,6.6862915 20,10 C20,13.3137085 17.3137085,16 14,16 L6,16 C2.6862915,16 0,13.3137085 0,10 C0,6.6862915 2.6862915,4 6,4 Z M7,8.75 C6.30964406,8.75 5.75,9.30964406 5.75,10 C5.75,10.6903559 6.30964406,11.25 7,11.25 C7.69035594,11.25 8.25,10.6903559 8.25,10 C8.25,9.30964406 7.69035594,8.75 7,8.75 Z M7,7.25 C8.51878306,7.25 9.75,8.48121694 9.75,10 C9.75,11.5187831 8.51878306,12.75 7,12.75 C5.48121694,12.75 4.25,11.5187831 4.25,10 C4.25,8.48121694 5.48121694,7.25 7,7.25 Z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="deactivate-b" fill="#fff">
          <use xlinkHref="#deactivate-a" />
        </mask>
        <use fill="#A9B1BA" fillRule="nonzero" xlinkHref="#deactivate-a" />
        <g fill={ color } mask="url(#deactivate-b)">
          <rect width={ width } height={ height } />
        </g>
      </g>
    </svg>
  )
}

IconDeactivate.defaultProps = {
  width: 20,
  height: 20,
  color: '#A9B1BA'
}

export default IconDeactivate
