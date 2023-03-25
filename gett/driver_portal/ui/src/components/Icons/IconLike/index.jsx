import React from 'react'

const IconLike = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="like-a" d="M0,19 L3.63636364,19 L3.63636364,8.2 L0,8.2 L0,19 L0,19 Z M20,9.1 C20,8.11 19.1818182,7.3 18.1818182,7.3 L12.4454545,7.3 L13.3090909,3.187 L13.3363636,2.899 C13.3363636,2.53 13.1818182,2.188 12.9363636,1.945 L11.9727273,1 L5.99090909,6.931 C5.65454545,7.255 5.45454545,7.705 5.45454545,8.2 L5.45454545,17.2 C5.45454545,18.19 6.27272727,19 7.27272727,19 L15.4545455,19 C16.2090909,19 16.8545455,18.55 17.1272727,17.902 L19.8727273,11.557 C19.9545455,11.35 20,11.134 20,10.9 L20,9.181 L19.9909091,9.172 L20,9.1 L20,9.1 Z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="like-b" fill="#fff">
          <use xlinkHref="#like-a" />
        </mask>
        <g fill={ color } mask="url(#like-b)">
          <rect width={ 20 } height={ 20 } transform="matrix(-1 0 0 1 20 0)" />
        </g>
      </g>
    </svg>
  )
}

IconLike.defaultProps = {
  width: 20,
  height: 20,
  color: '#D2DADC'
}

export default IconLike
