import React from 'react'
import { Dropdown, DropdownItem } from 'components/Dropdown'
import {
  IconActivate,
  IconDeactivate,
  IconInvite
} from 'components/Icons'

const Actions = ({ user, trigger, direction, onActivate, onDeactivate, onInvite }) => (
  <Dropdown trigger={ trigger } direction={ direction } nooverlay>
    <DropdownItem
      icon={ <IconActivate /> }
      label="Activate"
      onClick={ onActivate }
    />
    <DropdownItem
      icon={ <IconDeactivate /> }
      label="Deactivate"
      onClick={ onDeactivate }
    />
    <DropdownItem
      icon={ <IconInvite /> }
      label="Invite"
      onClick={ onInvite }
    />
  </Dropdown>
)

export default Actions
