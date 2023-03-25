import React from 'react'
import { Dropdown, DropdownItem } from 'components/Dropdown'
import { IconRemove, IconEdit, IconWatch } from 'components/Icons'
import Permissions from 'components/hocs/permissions'

const Actions = (props) => {
  const {
    item,
    trigger,
    onEdit,
    onPreview,
    onRemove
  } = props
  const Edit = Permissions('news_edit', <DropdownItem
    onClick={ () => onEdit(item) }
    icon={ <IconEdit width={ 20 } height={ 20 } /> }
  >
    Edit
  </DropdownItem>)
  const Preview = Permissions('news_edit', <DropdownItem
    onClick={ () => onPreview(item) }
    icon={ <IconWatch /> }>
    Watch Preview
  </DropdownItem>)

  return (
    <Dropdown trigger={ trigger }>
      <Edit />
      { item && item.itemType !== 'numbers' &&
        <Preview />
      }
      <DropdownItem
        onClick={ () => onRemove(item) }
        icon={ <IconRemove /> }
      >
        Remove
      </DropdownItem>
    </Dropdown>
  )
}

export default Actions
