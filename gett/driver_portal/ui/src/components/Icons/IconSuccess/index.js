import React from 'react'

const Icon = ({ className, color, circleColor, tickColor, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <g fill="none" fillRule="evenodd">
        <rect width="20" height="20" fill={ circleColor || color } rx="10" />
        <path fill={ tickColor || color } d="M13.25799,7.32992503 C13.6280033,6.92090847 14.2598506,6.88721392 14.6692895,7.25670989 C15.0794955,7.6258969 15.1125699,8.25771357 14.7434549,8.66884294 L10.2438995,13.6683705 C10.0609007,13.8723701 9.80162419,13.9917917 9.51319469,14 C9.23463067,14 8.97954451,13.8944649 8.79312707,13.7070472 L6.29307196,11.2069808 C5.90230935,10.8162165 5.90230935,10.1836349 6.29307196,9.79287048 C6.68384057,9.40210011 7.31643801,9.40210011 7.70720662,9.79287048 L9.46208963,11.5477614 L13.25799,7.32992503 Z" />
      </g>
    </svg>
  )
}

Icon.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default Icon
