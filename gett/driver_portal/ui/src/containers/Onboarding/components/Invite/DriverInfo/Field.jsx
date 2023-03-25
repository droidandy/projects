import React from 'react'
import styled from 'styled-components'

const Field = ({ label, children }) => (
  <Wrapper>
    <Label>{ label }</Label>
    <Value>{ children }</Value>
  </Wrapper>
)

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 15px;
`

const Label = styled.div`
  font-size: 10px;
  font-weight: 500;
  text-align: left;
  color: #a9b1ba;
  text-transform: uppercase;
  margin-bottom: 5px;
`

const Value = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: #303030;
`

export default Field
