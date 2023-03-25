import React from 'react'
import styled from 'styled-components'

import { getStatusIcon } from '../../utils'

const Vehicle = ({ approvalStatus, title, active, onClick }) => (
  <Wrapper onClick={ onClick }>
    <VehicleWrapper>
      <VehicleStatus>
        { getStatusIcon(approvalStatus) }
      </VehicleStatus>
      <VehicleName active={ active }>
        { title }
      </VehicleName>
    </VehicleWrapper>
    { active && <Status /> }
  </Wrapper>
)

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  cursor: pointer;
`

const VehicleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const VehicleName = styled.div`
  font-size: 16px;
  color: ${props => props.active ? '#000000' : '#8794a0'};
  font-weight: ${props => props.active ? 500 : 'normal'};
  margin-left: 10px;
`

const VehicleStatus = styled.div` 
  display: flex;
  align-items: center;
`

const Status = styled.div`
  position: absolute;
  width: 100%;
  height: 3px;
  border-radius: 3px;
  background-color: #eeaf2e;
  top: 38px;
`

export default Vehicle
