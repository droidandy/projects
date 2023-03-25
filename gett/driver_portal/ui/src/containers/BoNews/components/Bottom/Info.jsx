import React from 'react'
import styled from 'styled-components'
import { media } from 'components/Media'

const Info = ({ label, value, children }) => (
  <Wrapper>
    <Label>{ `${label}:` }</Label>
    <Text>{ value === undefined ? children : value }</Text>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 50px;

  ${media.phoneLarge`
    display: none;
  `}
`

const Label = styled.div`
  font-size: 14px;
  color: #a9b1ba;
  margin-right: 10px;
`

const Text = styled.div`
  font-weight: bold;
  color: #000000;
`
export default Info
