import React from 'react'
import { Dropdown, DropdownItem } from 'components/Dropdown'
import {
  IconActivate,
  IconDeactivate,
  IconInvite,
  IconReinvite,
  IconEdit
} from 'components/Icons'

const GridActions = (props) => {
  const {
    user,
    trigger,
    onActivate,
    onDeactivate,
    onInvite,
    onEdit
  } = props

  return (
    <Dropdown trigger={ trigger }>
      { user.active ? (
        <DropdownItem
          onClick={ () => onDeactivate(user) }
          icon={ <IconDeactivate /> }
        >
          Deactivate
        </DropdownItem>
      ) : (
        <DropdownItem
          onClick={ () => onActivate(user) }
          icon={ <IconActivate /> }
        >
          Activate
        </DropdownItem>
      )}

      {
        user.invite ? (
          user.invite.step !== 'accepted' && <DropdownItem
            onClick={ () => onInvite(user) }
            icon={ <IconReinvite /> }
          >
            Invite Again
          </DropdownItem>
        ) : (
          <DropdownItem
            onClick={ () => onInvite(user) }
            icon={ <IconInvite /> }
          >
            Invite
          </DropdownItem>
        )
      }

      <DropdownItem
        onClick={ () => onEdit(user) }
        icon={ <IconEdit /> }
      >
        Edit
      </DropdownItem>
    </Dropdown>
  )
}

export default GridActions
