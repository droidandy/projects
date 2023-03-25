import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { map } from 'lodash'

import Vehicle from './Vehicle'
import { getStatusIcon } from '../../utils'

class Header extends Component {
  renderVehicles() {
    const { vehicles, vehicleId } = this.props
    return <Fragment>
      { map(vehicles, (car, id) => (
        <Vehicle
          key={ `vehicleId${id}` }
          { ...car }
          active={ vehicleId === car.id }
          onClick={ () => this.select(car.id) }
        />))
      }
    </Fragment>
  }

  render() {
    const { approvalStatus, gettId } = this.props.user
    return (
      <Wrapper>
        <Id>
          { getStatusIcon(approvalStatus) }
          <UserName>
            { this.userName }
          </UserName>
          <Label>
            Gett ID:
          </Label>
          <GettId>
            { gettId }
          </GettId>
        </Id>
        <VechilesWrapper>
          { this.renderVehicles() }
        </VechilesWrapper>
      </Wrapper>
    )
  }

  select = (vehicleId) => {
    this.setState({ vehicleId }, () => this.props.selectVehicle(vehicleId))
  }

  get userName() {
    const { user } = this.props

    if (user.loading || !user.authenticated) {
      return null
    }

    return `${user.firstName} ${user.lastName}`
  }
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: #ffffff;
  padding: 20px 30px 20px 20px;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`

const Id = styled.div`
  display: flex;
  align-items: center;
`

const UserName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #303030;
  margin-left: 15px;
`

const Label = styled.div`
  font-size: 16px;
  color: #a9b1ba;
`

const GettId = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #282c37;
  margin-left: 5px;
`

const VechilesWrapper = styled.div`
  display: flex;
`

export default Header
