import React from 'react'
import styled from 'styled-components'

const Circle = ({ className, children }) => (
  <Wrapper className={ className }>
    <Value>
      { children }
    </Value>
  </Wrapper>
)

const Wrapper = styled.div`
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid #f6b530;
  width: 30px;
  height: 30px;
  text-align: center;
`

const Value = styled.span`
  font-size: 14px;
  line-height: 30px;
  color: #000;
  font-weight: bold;
`

export default Circle
