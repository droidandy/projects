import React from 'react'
import { Dropdown, DropdownItem } from 'components/Dropdown'
import { IconMail, IconShare, IconDownloadPDF } from 'components/Icons'

const Actions = ({ trigger, statements, onEmailMe, onShareWith, onDownloadPDF }) => (
  <Dropdown trigger={ trigger }>
    <DropdownItem
      onClick={ () => onEmailMe(statements) }
      icon={ <IconMail /> }
      label="Email Me"
    />

    <DropdownItem
      onClick={ () => onShareWith(statements) }
      icon={ <IconShare /> }
      label="Share With"
    />

    <DropdownItem
      onClick={ () => onDownloadPDF(statements) }
      icon={ <IconDownloadPDF /> }
      label="Download PDF"
    />
  </Dropdown>
)

export default Actions
