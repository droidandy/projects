import React from 'react'
import styled, { css } from 'styled-components'

const Badge = ({ position, children }) => {
  return (
    <Wrapper position={ position }>
      { children }
    </Wrapper>
  )
}

Badge.defaultProps = {
  position: 'center'
}

const Wrapper = styled.div`
  position: absolute;
  color: #ffffff;
  font-weight: 900;
  font-size: 9px;
  padding: 5px 10px;
  border-radius: 4px;
  background: rgba(0,0,0, 0.3);
  text-transform: uppercase;
  top: 20px;
    
  ${props => props.position === 'left' ? css`
    left: 20px;
  ` : css`
    left: 50%;
    transform: translateX(-50%);
  `}
`

export default Badge
