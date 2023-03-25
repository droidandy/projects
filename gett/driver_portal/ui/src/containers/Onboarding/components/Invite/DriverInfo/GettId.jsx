import React from 'react'
import styled from 'styled-components'
import { breakpoints } from 'components/Media'

const GettId = ({ label, children }) => (
  <Wrapper>
    <Label>{ label }</Label>
    <Value>{ children }</Value>
  </Wrapper>
)

const Wrapper = styled.div`
  margin-top: 5px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  ${breakpoints.phoneLarge`
    text-align: center;
    justify-content: center;
  `}
`

const Label = styled.div`
  margin-right: 5px;
  font-size: 14px;
  text-align: left;
  color: #a9b1ba;
  font-weight: 400;
`

const Value = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #282c37;
`

export default GettId
