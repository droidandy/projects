import React from 'react'

const Icon = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <path fill={ color } fillRule="nonzero" d="M11.874 5.61h-1.517V3.654A3.647 3.647 0 0 0 6.703 0 3.647 3.647 0 0 0 3.05 3.653v1.958H1.533C.685 5.61 0 6.296 0 7.144v7.323C0 15.315.685 16 1.533 16h10.324c.848 0 1.533-.685 1.533-1.533V7.144a1.507 1.507 0 0 0-1.516-1.533zM4.42 3.654A2.29 2.29 0 0 1 6.703 1.37a2.29 2.29 0 0 1 2.284 2.283v1.958H4.42V3.653zm7.617 10.814a.163.163 0 0 1-.163.163H1.534a.163.163 0 0 1-.164-.163V7.144c0-.098.082-.163.163-.163h10.324c.098 0 .163.081.163.163v7.323h.017zM6.703 9.052a1.403 1.403 0 0 0-.717 2.61v1.402h1.451v-1.402c.408-.245.685-.685.685-1.207a1.417 1.417 0 0 0-1.419-1.403z" />
    </svg>
  )
}

Icon.defaultProps = {
  width: 20,
  height: 20,
  color: '#74818F'
}

export default Icon
