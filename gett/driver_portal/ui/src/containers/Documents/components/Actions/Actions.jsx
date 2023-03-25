import React, { Component, Fragment } from 'react'
import { Dropdown, DropdownItem } from 'components/Dropdown'
import { IconRemove, IconEdit, IconVehicles } from 'components/Icons'

import ConfirmationDialog from './ConfirmationDialog'

class Actions extends Component {
  state = {
    confirmationActive: false
  }

  render() {
    const {
      item,
      trigger,
      onRemove,
      onRename,
      onSetAsCurrent,
      wizard,
      vehiclesCount
    } = this.props
    const { confirmationActive } = this.state

    return (
      <Fragment>
        <Dropdown
          width={ 200 }
          trigger={ trigger }
          nooverlay
        >
          { vehiclesCount > 1 && <DropdownItem
            onClick={ this.openConfirmation }
            icon={ <IconRemove /> }
          >
              Remove vehicle
          </DropdownItem>
          }
          <DropdownItem
            onClick={ () => onRename(item) }
            icon={ <IconEdit /> }
          >
            Rename vehicle
          </DropdownItem>
          { !wizard && <DropdownItem
            onClick={ () => onSetAsCurrent(item) }
            icon={ <IconVehicles /> }
          >
            Set as current vehicle
          </DropdownItem>
          }
        </Dropdown>
        <ConfirmationDialog
          active={ confirmationActive }
          onRemove={ onRemove }
          onClose={ this.closeConfirmation }
        />
      </Fragment>
    )
  }

  openConfirmation = () => {
    this.setState({
      confirmationActive: true
    })
  }

  closeConfirmation = () => {
    this.setState({
      confirmationActive: false
    })
  }
}

export default Actions
