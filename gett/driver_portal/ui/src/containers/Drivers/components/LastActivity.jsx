import React from 'react'
import styled from 'styled-components'

import { DateTime } from 'components/DateTime'

const LastActivity = ({ lastActivityAt }) => (
  <Wrapper>
    { lastActivityAt && <DateTime value={ lastActivityAt } format="DD MMM, YYYY" /> }
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  color: #a9b1ba;
  margin-top: 3px;
`

export default LastActivity
