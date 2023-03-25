import React from 'react'
import styled from 'styled-components'
import { getStatusIcon } from 'containers/BoAlerts/utils'

const DocumentCheck = ({ documentsReady }) => (
  <Wrapper>
    { getStatusIcon(documentsReady ? 'approved' : 'rejected') }
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
`

export default DocumentCheck
