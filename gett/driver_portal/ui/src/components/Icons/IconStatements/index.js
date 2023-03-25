import React from 'react'

const IconStatements = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <path fill={ color } d="M3,2.50370994 C3,1.67323387 3.62874867,1 4.40000894,1 L15.5999911,1 C16.3731947,1 17,1.67276967 17,2.50370994 L17,17.49629 C17,18.3267661 16.3712513,19 15.5999911,19 L4.40000894,19 C3.62680535,19 3,18.3272303 3,17.49629 L3,2.50370994 Z M4.4,17.49629 C4.4,17.4993977 15.5999911,17.5 15.5999911,17.5 C15.5982516,17.5 15.6,2.50370994 15.6,2.50370994 C15.6,2.50060234 4.40000894,2.5 4.40000894,2.5 C4.40174837,2.5 4.4,17.49629 4.4,17.49629 Z M5.8,6.25 C5.8,5.83578644 6.11437434,5.5 6.49677828,5.5 L12.1032217,5.5 C12.4880417,5.5 12.8,5.8328986 12.8,6.25 C12.8,6.66421356 12.4856257,7 12.1032217,7 L6.49677828,7 C6.11195825,7 5.8,6.6671014 5.8,6.25 Z M5.8,9.25 C5.8,8.83578644 6.11437434,8.5 6.49677828,8.5 L12.1032217,8.5 C12.4880417,8.5 12.8,8.8328986 12.8,9.25 C12.8,9.66421356 12.4856257,10 12.1032217,10 L6.49677828,10 C6.11195825,10 5.8,9.6671014 5.8,9.25 Z M5.8,12.25 C5.8,11.8357864 6.11568264,11.5 6.50298557,11.5 L9.29701443,11.5 C9.68526264,11.5 10,11.8328986 10,12.25 C10,12.6642136 9.68431736,13 9.29701443,13 L6.50298557,13 C6.11473736,13 5.8,12.6671014 5.8,12.25 Z" />
    </svg>
  )
}

IconStatements.defaultProps = {
  width: 20,
  height: 20
}

export default IconStatements
