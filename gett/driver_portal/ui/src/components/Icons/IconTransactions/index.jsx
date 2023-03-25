import React from 'react'
import IconBase from 'react-icon-base'

const IconTransactions = ({ props, className, color }) => {
  return <IconBase viewBox="0 0 15 18" { ...props } width={ 15 } height={ 18 } className={ className }>
    <path fill={ color || '#f6b530' } fillRule="nonzero" stroke={ color || '#f6b530' } strokeWidth=".2" d="M9.648 1H1v16.408L2.596 19l1.635-1.63L5.865 19 7.5 17.37 9.135 19l1.634-1.63L12.404 19l.532-.53L14 17.407V5.282L9.648 1zm.323 1.819l2.185 2.179H9.971v-2.18zm2.927 14.154l-.533.53-1.634-1.63-1.635 1.63-1.634-1.63-1.635 1.63-1.634-1.63-1.635 1.63-.532-.53V2.06h6.842V6.04h3.992v10.933h.038zm-8.876-4.017h6.937v1.06H4.022v-1.06zm0-2.444h6.937v1.06H4.022v-1.06zm0-2.426h6.937v1.061H4.022v-1.06z" />
  </IconBase>
}

export default IconTransactions
