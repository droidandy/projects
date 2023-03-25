import React from 'react'
import { Dropdown, DropdownItem } from 'components/Dropdown'
import { IconMail, IconShare, IconDownloadPDF } from 'components/Icons'

const Actions = ({ trigger, earnings, onEmailMe, onShareWith, onDownloadCSV }) => (
  <Dropdown trigger={ trigger }>
    <DropdownItem
      onClick={ () => onEmailMe(earnings) }
      icon={ <IconMail /> }
      label="Email Me"
    />

    <DropdownItem
      onClick={ () => onShareWith(earnings) }
      icon={ <IconShare /> }
      label="Share With"
    />

    <DropdownItem
      onClick={ () => onDownloadCSV(earnings) }
      icon={ <IconDownloadPDF /> }
      label="Download CSV"
    />
  </Dropdown>
)

export default Actions
