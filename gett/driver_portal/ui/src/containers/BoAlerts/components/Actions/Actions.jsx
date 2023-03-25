import React, { Component } from 'react'
import styled from 'styled-components'
import { bindState } from 'components/form'
import { Button } from 'components/Button'
import { IconLoginAs } from 'components/Icons'

import Notification from './Notification'

class Actions extends Component {
  state = {
    notificationDialog: {
      active: false
    },
    form: {
      subject: 'Gett Documents Notification'
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notification !== this.state.form) {
      this.setState({ form: nextProps.notification })
    }
  }

  sendNotification = (item) => {
    this.props.sendNotification(item)
    this.setState({
      notificationDialog: {
        active: false
      }
    })
  }

  render() {
    const { onLoginAsUser, onNextDriver, exit, finished, loadMessage } = this.props
    const { notificationDialog } = this.state
    return (
      <Wrapper>
        <ExitButton onClick={ exit }>
          Exit alerts
        </ExitButton>
        <ButtonStyled onClick={ onLoginAsUser }>
          <IconLoginAsStyled color="#000" />
          Login As Driver
        </ButtonStyled>
        <Button onClick={ this.openNotificationDialog }>
          Send Notification
        </Button>
        <Button disabled={ !finished } onClick={ onNextDriver }>
          Next Driver
        </Button>
        <Notification
          { ...bindState(this) }
          loadMessage={ loadMessage }
          active={ notificationDialog.active }
          onClose={ this.closeNotificationDialog }
          onRequestSave={ this.sendNotification }
        />
      </Wrapper>
    )
  }

  closeNotificationDialog = () => {
    this.setState(state => ({
      ...state,
      notificationDialog: {
        active: false
      }
    }))
  }

  openNotificationDialog = () => {
    this.props.loadMessage()
    this.setState(state => ({
      ...state,
      notificationDialog: {
        active: true
      }
    }))
  }
}

const ExitButton = styled(Button)`
  background: #fff;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  
  button {
    margin-right: 20px;
    &:last-child {
      margin:left:0
    }
  }
`

const ButtonStyled = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`

const IconLoginAsStyled = styled(IconLoginAs)`
  margin-right: 10px;
`

export default Actions
