import React from 'react'
import styled from 'styled-components'

const Circle = ({ number, active }) => {
  return (
    <Wrapper active={ active }>
      { number }
    </Wrapper>
  )
}

Circle.defaultProps = {
  active: true
}

const Wrapper = styled.div`
  flex-shrink: 0;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  text-align: center;
  font-size: 14px;
  line-height: 30px;
  color: #000;
  font-weight: bold;

  ${props => props.active ? `border: 1px solid #f6b530` : `border: 1px solid #d2dadc`};
`

export default Circle
