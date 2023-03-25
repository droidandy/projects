import React, { Component } from 'react'
import styled from 'styled-components'
import { isEmpty, map } from 'lodash'
import { timeFromNow } from 'utils'

import { Dialog, DialogHeader, DialogBody } from 'components/Dialog'
import {
  Grid,
  GridHeader,
  GridHeaders,
  GridRow,
  GridColumn,
  ScrollableBody
} from 'components/Grid'
import { Empty } from 'components/Empty'
import { Button } from 'components/Button'
import { Active, Inactive, InProgress, Offline } from 'components/Status'

import Confirm from './Confirm'

class AssignDialog extends Component {
  state = {}

  renderStatus(status) {
    switch (status) {
      case 'available':
        return <Active>available</Active>
      case 'in_progress':
        return <InProgress>in progress</InProgress>
      case 'busy':
        return <Inactive>busy</Inactive>
      default:
        return <Offline>offline</Offline>
    }
  }

  render() {
    const { active, agents: { users, loading }, driver } = this.props
    const { agentId } = this.state
    return (
      <DialogStyled width={ 760 } onClose={ this.close } active={ active }>
        <DialogHeader background="#f4f7fa" close>
          Assign Driver to Agent
        </DialogHeader>
        <DialogBodyStyled>
          <GridWrapper>
            {
              isEmpty(users) ? (
                <Empty loading={ loading } />
              ) : (
                <Grid>
                  <GridHeaders>
                    <GridHeader flex={ 2 }>Agent</GridHeader>
                    <GridHeader>Status</GridHeader>
                    <GridHeader>Status time</GridHeader>
                    <GridHeader>Assigned drivers</GridHeader>
                    <GridHeader flex={ 1 } />
                  </GridHeaders>
                  <ScrollableBody>
                    {
                      map(users, user => {
                        if (agentId && user.id === agentId) {
                          return <Confirm
                            key={ `AgentConfirm_${user.id}` }
                            assign={ () => this.assignUser(user.id) }
                            cancel={ this.cancelAssign }
                            name={ driver.name }
                            agentName={ `${user.firstName} ${user.lastName}` }
                          />
                        }
                        return (<GridRow key={ `Agent_${user.id}` }>
                          <GridColumn flex={ 2 }>{`${user.firstName} ${user.lastName}`}</GridColumn>
                          <GridColumn>
                            <StatusLabelsHolder>
                              { this.renderStatus(user.agentStatus) }
                            </StatusLabelsHolder>
                          </GridColumn>
                          <GridColumn>{ user.agentStatusUpdatedAt ? timeFromNow(user.agentStatusUpdatedAt) : `-` }</GridColumn>
                          <GridColumn>{ user.assignedDriversCount || `-` }</GridColumn>
                          <GridColumn flex={ 1 }>
                            <AssignButton
                              onClick={ () => this.assign(user.id) }
                              disabled={ !(user.agentStatus === 'available') }
                            >
                              Assign
                            </AssignButton>
                          </GridColumn>
                        </GridRow>
                        )
                      })
                    }
                  </ScrollableBody>
                </Grid>
              )
            }
          </GridWrapper>
        </DialogBodyStyled>
      </DialogStyled>
    )
  }

  assign = (agentId) => {
    this.setState({ agentId })
  }

  assignUser = (agentId) => {
    const { driver, assignUser } = this.props
    this.setState({ agentId: null }, () => assignUser({ driver, agentId }))
  }

  cancelAssign = () => {
    this.setState({ agentId: null })
  }

  close = () => {
    this.setState({ agentId: null }, this.props.onClose)
  }
}

const DialogStyled = styled(Dialog)`
  background: #f4f7fa;
`

const DialogBodyStyled = styled(DialogBody)`
  padding: 0;
`

const GridWrapper = styled.div`
  padding: 30px;
  margin: 10px 0 30px 0;
  width: 100%;
  height: 100%;
  background-color: #f4f7fa;
`

const AssignButton = styled(Button)`
  width: 100px;
  height: 30px;
  margin-right: 0;
`

const StatusLabelsHolder = styled.div`
  display: flex;
`

export default AssignDialog
