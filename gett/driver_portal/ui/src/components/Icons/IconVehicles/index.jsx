import React from 'react'

const IconVehicles = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="cars-a" d="M19.449 8.34h-2.56l-4.45-4.187A.554.554 0 0 0 12.057 4H5.17a.547.547 0 0 0-.468.259l-2.576 4.08H.556A.553.553 0 0 0 0 8.894V13.6c0 .306.248.553.555.553h.985a2.408 2.408 0 0 0 4.686 0h7.548a2.408 2.408 0 0 0 4.686 0h.985A.553.553 0 0 0 20 13.6V8.893a.548.548 0 0 0-.551-.553zM9.537 5.11h2.3l3.434 3.23H9.537V5.11zm-4.06 0h2.95v3.23h-4.99l2.04-3.23zm-1.594 9.784c-.717 0-1.3-.58-1.3-1.293 0-.714.583-1.294 1.3-1.294.716 0 1.3.58 1.3 1.29v.008c0 .713-.584 1.29-1.3 1.29zm12.238 0c-.716 0-1.3-.58-1.3-1.29v-.003-.004c0-.714.584-1.29 1.3-1.29.717 0 1.3.58 1.3 1.294 0 .713-.583 1.293-1.3 1.293zm2.772-1.846h-.429a2.408 2.408 0 0 0-4.686 0H6.226a2.408 2.408 0 0 0-4.686 0h-.43V9.445h17.783v3.603zM7.375 10.202h1.052v1.047H7.375v-1.047zm4.202 0h1.051v1.047h-1.05v-1.047zm-2.103 0h1.052v1.047H9.474v-1.047zm-1.047 1.043h1.051v1.046H8.427v-1.046zm2.099 0h1.051v1.046h-1.051v-1.046z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="cars-b" fill="#fff">
          <use xlinkHref="#cars-a" />
        </mask>
        <use fill="#000" fillRule="nonzero" xlinkHref="#cars-a" />
        <g fill={ color } mask="url(#cars-b)">
          <path d="M0 0h20v20H0z" />
        </g>
      </g>
    </svg>
  )
}

IconVehicles.defaultProps = {
  width: 20,
  height: 20,
  color: '#A9B1BA'
}

export default IconVehicles
