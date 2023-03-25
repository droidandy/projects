import React from 'react'

const IconDislike = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="dislike-a" d="M12.7272727,1 L4.54545455,1 C3.79090909,1 3.14545455,1.45 2.87272727,2.098 L0.127272727,8.443 C0.0454545455,8.65 0,8.866 0,9.1 L0,10.819 L0.00909090909,10.828 L0,10.9 C0,11.89 0.818181818,12.7 1.81818182,12.7 L7.55454545,12.7 L6.69090909,16.813 L6.66363636,17.101 C6.66363636,17.47 6.81818182,17.812 7.06363636,18.055 L8.02727273,19 L14.0181818,13.069 C14.3454545,12.745 14.5454545,12.295 14.5454545,11.8 L14.5454545,2.8 C14.5454545,1.81 13.7272727,1 12.7272727,1 L12.7272727,1 Z M16.3636364,1 L16.3636364,11.8 L20,11.8 L20,1 L16.3636364,1 L16.3636364,1 Z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="dislike-b" fill="#fff">
          <use xlinkHref="#dislike-a" />
        </mask>
        <g fill={ color } mask="url(#dislike-b)">
          <rect width={ 20 } height={ 20 } />
        </g>
      </g>
    </svg>
  )
}

IconDislike.defaultProps = {
  width: 20,
  height: 20,
  color: '#D2DADC'
}

export default IconDislike
