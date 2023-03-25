import React, { Fragment } from 'react'
import { Dropdown, DropdownItem } from 'components/Dropdown'
import {
  IconActivate,
  IconDeactivate,
  IconInvite,
  IconReinvite,
  IconLoginAs,
  IconDocuments,
  IconErrorOutline,
  IconReview
} from 'components/Icons'
import Permissions from 'components/hocs/permissions'

const GridActions = (props) => {
  const {
    user,
    driverToApproveId,
    trigger,
    onActivate,
    onDeactivate,
    onInvite,
    onLoginAsUser,
    onComplianceView,
    onUnclaim,
    onStartReview
  } = props
  const Activate = Permissions('drivers_actions', <DropdownItem
    onClick={ () => onActivate(user) }
    icon={ <IconActivate /> }
  >
    Activate
  </DropdownItem>)

  const DeActivate = Permissions('drivers_actions', <DropdownItem
    onClick={ () => onDeactivate(user) }
    icon={ <IconDeactivate /> }
  >
    Deactivate
  </DropdownItem>)

  const Invite = Permissions('drivers_actions', <DropdownItem
    onClick={ () => onInvite(user) }
    icon={ <IconInvite /> }
  >
    Invite
  </DropdownItem>)

  const InviteAgain = Permissions('drivers_actions', <DropdownItem
    onClick={ () => onInvite(user) }
    icon={ <IconReinvite /> }
  >
    Invite Again
  </DropdownItem>)

  const LoginAs = Permissions('drivers_actions', <DropdownItem
    onClick={ () => onLoginAsUser(user) }
    icon={ <IconLoginAs /> }
  >
    Login As
  </DropdownItem>)

  const ComplianceView = Permissions('alerts_edit', <DropdownItem
    onClick={ () => onComplianceView(user) }
    icon={ <IconDocuments color="#a9b1ba" /> }
  >
    Compliance View
  </DropdownItem>)

  const Unclaim = Permissions('alerts_edit', <DropdownItem
    onClick={ () => onUnclaim(user) }
    icon={ <IconErrorOutline color="#a9b1ba" /> }
  >
    Unclaim
  </DropdownItem>)

  const StartReview = Permissions('review_edit', <DropdownItem
    onClick={ () => onStartReview(user) }
    icon={ <IconReview color="#a9b1ba" /> }
  >
    Start Review
  </DropdownItem>)

  return (
    <Dropdown trigger={ trigger }>
      { user.active ? <DeActivate /> : <Activate /> }
      { user.invite ? user.invite.step !== 'accepted' && <InviteAgain /> : <Invite /> }
      <LoginAs />
      { user.roles.includes('apollo_driver') && (
        <Fragment>
          { (driverToApproveId !== user.id) && <ComplianceView /> }
          { (driverToApproveId === user.id) && <Unclaim /> }
          <StartReview />
        </Fragment>
      )
      }
    </Dropdown>
  )
}

export default GridActions
