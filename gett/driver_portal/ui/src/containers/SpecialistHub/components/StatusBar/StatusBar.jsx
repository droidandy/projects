import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

import { Button } from 'components/Button'
import { SelectDropdown } from 'components/SelectDropdown'
import { ConfirmationDialog } from 'components/ConfirmationDialog'
import { Timer } from '../Timer'

class StatusBar extends Component {
  state = {
    showDialog: false
  }

  render() {
    const { trainingStartedAt, status, disableStart } = this.props
    const { showDialog } = this.state
    return (
      <Wrapper>
        <Timer
          run={ this.isInStatus('in_progress') }
          startTime={ trainingStartedAt }
        />
        <SwitchButton onClick={ this.onSwitchButtonClick } disabled={ disableStart }>
          {this.isInStatus('in_progress') ? 'Finish' : 'Start'}
        </SwitchButton>
        <StatusDropdown
          onChange={ this.onChange }
          disabled={ this.isInStatus('in_progress') }
          selected={ status }
          nooverlay
          noSelect={ this.isInStatus('available') }
        >
          {
            this.isInStatus('in_progress')
              ? <Status color="#f6b530" value="in_progress">In Progress</Status>
              : <Fragment />
          }
          <Status color="#6bc11a" value="available">Available</Status>
          <Status color="#ff0000" value="busy">Busy</Status>
        </StatusDropdown>
        <ConfirmationDialog
          active={ showDialog }
          onClose={ this.onClose }
          onConfirm={ this.setBusy }
        >
          <div>
            Are you sure? All assigned drivers to you will be unassigned
          </div>
        </ConfirmationDialog>
      </Wrapper>
    )
  }

  isInStatus = (status) => {
    return this.props.status === status
  }

  onSwitchButtonClick = () => {
    const { setStatus } = this.props
    this.isInStatus('in_progress')
      ? this.confirmBusy()
      : setStatus('in_progress')
  }

  confirmBusy = () => {
    const { drivers } = this.props
    this.isInStatus('in_progress') || drivers
      ? this.setState({ showDialog: true })
      : this.setBusy()
  }

  setBusy = () => {
    this.props.setStatus('busy')
    this.onClose()
  }

  onClose = () => {
    this.setState({ showDialog: false })
  }

  onChange = () => {
    const { setStatus } = this.props
    if (this.isInStatus('busy')) {
      setStatus('available')
    } else {
      this.confirmBusy()
    }
  }
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const SwitchButton = styled(Button)`
  max-width: 120px;
  margin-right: 30px;
`

const StatusDropdown = styled(SelectDropdown)`
  height: 40px;
  width: 200px;
`

const Status = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding-left: 15px;
  cursor: pointer;
  &:before{
    content: '';
    width: 15px;
    height: 15px;
    background-color: ${({ color }) => color};
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
    margin-right: 15px;
  } 
`

export default StatusBar
