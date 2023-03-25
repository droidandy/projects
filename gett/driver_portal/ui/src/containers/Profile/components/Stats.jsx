import React from 'react'
import { media } from 'components/Media'
import styled from 'styled-components'

const Stats = ({ label, value = 0, prefix = '', className }) => {
  return <Wrapper className={ className }>
    <StatsValue>
      {`${prefix}${value}`}
    </StatsValue>
    <Label>
      {label}
    </Label>
  </Wrapper>
}

const Wrapper = styled.div`
  margin: 0 0 0 20px;
  min-width: 75px;
  ${media.phoneSmall`
    min-width: auto;
  `}
`

const StatsValue = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: #303030;
`

const Label = styled.div`
  font-size: 14px;
  color: #6e7a87;
  margin-top: 5px;
`

export default Stats
