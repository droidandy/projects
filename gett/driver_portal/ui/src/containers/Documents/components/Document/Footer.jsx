import React from 'react'
import styled from 'styled-components'

const Footer = ({ children, className }) => {
  return (
    <Wrapper className={ className }>
      { children }
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  align-items: center;
`

export default Footer
