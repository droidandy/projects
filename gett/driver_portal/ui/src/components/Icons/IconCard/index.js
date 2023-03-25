import React from 'react'

const IconCard = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <path fill={ color } d="M17.4418605,3 L2.55813953,3 C1.13953488,3 0,4.071875 0,5.40625 L0,14.59375 C0,15.928125 1.13953488,17 2.55813953,17 L17.4418605,17 C18.8604651,17 20,15.928125 20,14.59375 L20,5.40625 C20,4.071875 18.8604651,3 17.4418605,3 Z M2.55813953,4.3125 L17.4418605,4.3125 C18.0930233,4.3125 18.6046512,4.79375 18.6046512,5.40625 L18.6046512,6.9375 L1.39534884,6.9375 L1.39534884,5.40625 C1.39534884,4.79375 1.90697674,4.3125 2.55813953,4.3125 Z M17.4418605,15.6875 L2.55813953,15.6875 C1.90697674,15.6875 1.39534884,15.20625 1.39534884,14.59375 L1.39534884,8.25 L18.6046512,8.25 L18.6046512,14.59375 C18.6046512,15.20625 18.0930233,15.6875 17.4418605,15.6875 Z M3.84229651,10 L7.46002907,10 C7.82246594,10 8.11627907,10.2938131 8.11627907,10.65625 L8.11627907,10.65625 C8.11627907,11.0186869 7.82246594,11.3125 7.46002907,11.3125 L3.84229651,11.3125 C3.47985964,11.3125 3.18604651,11.0186869 3.18604651,10.65625 L3.18604651,10.65625 C3.18604651,10.2938131 3.47985964,10 3.84229651,10 Z M3.84229651,12.625 L13.087936,12.625 C13.4503729,12.625 13.744186,12.9188131 13.744186,13.28125 L13.744186,13.28125 C13.744186,13.6436869 13.4503729,13.9375 13.087936,13.9375 L3.84229651,13.9375 C3.47985964,13.9375 3.18604651,13.6436869 3.18604651,13.28125 L3.18604651,13.28125 C3.18604651,12.9188131 3.47985964,12.625 3.84229651,12.625 Z" />
    </svg>
  )
}

IconCard.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default IconCard
