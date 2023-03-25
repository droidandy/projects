import React from 'react'

const IconApproved = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <defs>
        <path id="approved-copy-a" d="M13.824074,7.1865285 C13.5711256,6.93782383 13.1758938,6.93782383 12.9229454,7.1865285 C12.9229454,7.1865285 12.9229454,7.1865285 12.9229454,7.1865285 L8.55958587,11.4766839 L7.08932342,9.92227979 C6.83637504,9.67357513 6.4411432,9.67357513 6.18819482,9.92227979 C5.95105571,10.1554404 5.93524644,10.5284974 6.15657627,10.7772021 L8.06949839,12.8134715 C8.1801633,12.9378238 8.35406532,13 8.52796733,13 L8.5437766,13 C8.71767861,13 8.87577135,12.9378238 8.98643626,12.8134715 L13.8082647,8.07253886 C14.0612131,7.8238342 14.0612131,7.43523316 13.824074,7.1865285 Z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <circle cx={ 10 } cy={ 10 } r={ 10 } fill={ color } />
        <use fill="#FFF" stroke="#FFF" strokeWidth=".6" xlinkHref="#approved-copy-a" />
      </g>
    </svg>
  )
}

IconApproved.defaultProps = {
  width: 20,
  height: 20,
  color: '#6BC11A'
}

export default IconApproved
