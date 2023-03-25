import React from 'react'
import styled from 'styled-components'
import { sizes, breakpoints } from 'components/Media'
import { MediaQuery } from 'components/MediaQuery'

const Field = ({ label, visibleTill, children }) => (
  <MediaQuery maxWidth={ visibleTill }>
    <Wrapper>
      <Label>{ label }</Label>
      <Value>{ children }</Value>
    </Wrapper>
  </MediaQuery>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;

  ${breakpoints.phoneLarge`
    max-width: ${sizes.phoneSmall}px;
  `}

  &:last-child {
    margin-bottom: 0;
  }
`

const Label = styled.div`
  font-size: 10px;
  font-weight: bold;
  text-align: left;
  color: #a9b1ba;
  text-transform: uppercase;
`

const Value = styled.div`
  font-size: 14px;
  color: #000000;
`

export default Field
