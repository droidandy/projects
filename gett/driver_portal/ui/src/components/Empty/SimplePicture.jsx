import React from 'react'

const SimplePicture = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 119 43" width={ width } height={ height } className={ className }>
      <g fill="none" fill-rule="evenodd" transform="translate(.515 .866)">
        <rect width="117.979" height="41.521" fill="#FFF" rx="13.5" />
        <rect width="66.081" height="4.353" x="41.061" y="8.595" fill="#1B3554" opacity=".3" rx="2.176" />
        <rect width="48.668" height="4.353" x="41.061" y="16.529" fill="#1B3554" opacity=".3" rx="2.176" />
        <rect width="18.897" height="4.353" x="41.061" y="28.43" fill="#1B3554" opacity=".15" rx="2.176" />
        <ellipse cx="21.165" cy="15.445" fill="#BAC2CB" rx="10.725" ry="10.156" />
        <path fill="#FFF" fill-rule="nonzero" d="M19.4445835,19.213596 C19.6486774,19.4074852 19.9154087,19.5041818 20.182662,19.5041818 C20.4499153,19.5041818 20.7166467,19.4074852 20.9207405,19.213596 L26.1405317,14.2547944 C26.5481974,13.867512 26.5481974,13.2397277 26.1405317,12.8524453 C25.732866,12.4651629 25.0720405,12.4651629 24.6643748,12.8524453 L20.182662,17.1095765 L17.7888658,14.8359659 C17.3812001,14.4486835 16.7203745,14.4486835 16.3127088,14.8359659 C15.9050431,15.2232483 15.9050431,15.8510326 16.3127088,16.238315 L19.4445835,19.213596 Z" />
      </g>
    </svg>
  )
}

SimplePicture.defaultProps = {
  width: 119,
  height: 43
}

export default SimplePicture
