import React from 'react'

const Icon = ({ className, color, width, height }) => {
  return (
    <svg viewBox="0 0 20 20" width={ width } height={ height } className={ className }>
      <path fill={ color } d="M2.04545444,3 C0.924068073,3 0,3.91810571 0,5.03225643 L0,14.9677436 C0,16.0818943 0.924068073,17 2.04545444,17 L17.9545454,17 C19.0759318,17 20,16.0818943 20,14.9677436 L20,5.03225643 C20,3.91810571 19.0759318,3 17.9545454,3 L2.04545444,3 Z M2.04545444,4.35483762 L17.9545454,4.35483762 C18.3440679,4.35483762 18.6363636,4.64524706 18.6363636,5.03225643 L18.6363636,14.9677436 C18.6363636,15.3547529 18.3440679,15.6451624 17.9545454,15.6451624 L2.04545444,15.6451624 C1.65593194,15.6451624 1.36363626,15.3547529 1.36363626,14.9677436 L1.36363626,5.03225643 C1.36363626,4.64524706 1.65593194,4.35483762 2.04545444,4.35483762 Z M16.9176136,5.68849461 C16.7489931,5.69704719 16.5895622,5.76744993 16.4701818,5.88607509 L10.4758636,11.383069 C10.1848865,11.649814 9.79979562,11.6494527 9.50995449,11.383069 L3.52981809,5.88607509 C3.39580701,5.76078604 3.2165186,5.69462801 3.03268172,5.70263008 C2.75575454,5.71285747 2.51259963,5.88858112 2.41751797,6.14719776 C2.32243632,6.4058144 2.39434112,6.69588128 2.59943172,6.88104526 L6.08663628,10.084683 L2.61363626,13.0977967 C2.4285779,13.257588 2.34367142,13.5035149 2.3910446,13.7425211 C2.43841778,13.9815274 2.61083472,14.1771065 2.84305456,14.2552534 C3.0752744,14.3334003 3.33182733,14.2821786 3.51563627,14.1209701 L7.09518174,11.0090887 L8.5866363,12.3780166 C9.37502267,13.1024709 10.6106818,13.1079806 11.3991363,12.3850166 L12.8977272,11.009021 L16.4843636,14.1209023 C16.6681726,14.2821109 16.9247255,14.3333326 17.1569453,14.2551857 C17.3891652,14.1770388 17.5615821,13.9814596 17.6089553,13.7424534 C17.6563285,13.5034472 17.571422,13.2575202 17.3863636,13.097729 L13.90625,10.0846153 L17.3934545,6.88097752 C17.6158085,6.69293262 17.6929749,6.38509575 17.5853639,6.11540145 C17.4777529,5.84570715 17.2092516,5.67402138 16.9176136,5.68842686 L16.9176136,5.68849461 Z" />
    </svg>
  )
}

Icon.defaultProps = {
  width: 20,
  height: 20,
  color: '#a9b1ba'
}

export default Icon
