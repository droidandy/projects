import React from 'react'
import styled from 'styled-components'
import { getStatusIcon } from 'containers/BoAlerts/utils'

const Status = ({ status }) => (
  <Wrapper>
    { getStatusIcon(status ? 'approved' : 'rejected') }
    <StatusLabel>{status ? 'Verified' : 'Not Verified'}</StatusLabel>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  margin-right: 10px;
`

const StatusLabel = styled.div`
  font-size: 14px;
  color: #000;
  font-weight: bold;
  margin-left: 15px;
`

export default Status
