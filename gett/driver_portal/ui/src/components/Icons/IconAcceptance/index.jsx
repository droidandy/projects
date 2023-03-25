import React from 'react'

const IconAcceptance = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <path fill={ color } d="M2,14.5 L2,5.5 C2,3.575 3.56006234,2 5.46680521,2 L13.4652201,2 C14.0100038,2 14.4557358,2.45 14.4557358,3 C14.4557358,3.55 14.0100038,4 13.4652201,4 L5.46680521,4 C4.64962969,4 3.98103155,4.675 3.98103155,5.5 L3.98103155,14.5 C3.98103155,15.325 4.64962969,16 5.46680521,16 L14.3814472,16 C15.1986227,16 15.8672208,15.325 15.8672208,14.5 L15.8672208,9.525 C15.8672208,8.975 16.3129529,8.525 16.8577366,8.525 C17.4025203,8.525 17.8482524,8.975 17.8482524,9.525 L17.8482524,14.5 C17.8482524,16.425 16.28819,18 14.3814472,18 L5.46680521,18 C3.56006234,18 2,16.425 2,14.5 Z M17.7244379,3.925 C18.0958813,4.325 18.0958813,4.95 17.699675,5.35 L10.1469922,12.975 C9.97365197,13.175 9.72602303,13.275 9.45363119,13.275 L9.4288683,13.275 C9.15647646,13.275 8.88408462,13.175 8.71074436,12.975 L5.71443415,9.7 C5.36775363,9.3 5.39251652,8.7 5.76395994,8.325 C6.16016625,7.925 6.77923861,7.925 7.17544492,8.325 L9.47839409,10.825 L16.3129529,3.925 C16.7091592,3.525 17.3282316,3.525 17.7244379,3.925 Z" />
    </svg>
  )
}

IconAcceptance.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconAcceptance
