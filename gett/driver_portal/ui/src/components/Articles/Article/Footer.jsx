import React from 'react'
import styled from 'styled-components'

const Footer = ({ children, className, color }) => {
  return (
    <Wrapper className={ className } color={ color }>
      { children }
    </Wrapper>
  )
}

Footer.defaultProps = {
  color: '#ffffff'
}

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  color: ${props => props.color};
  border-top: solid 1px rgba(255,255,255,0.2);
  padding: 10px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export default Footer
