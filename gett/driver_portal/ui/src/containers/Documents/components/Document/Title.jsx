import React from 'react'
import styled from 'styled-components'

const Title = ({ children }) => {
  return (
    <Wrapper>
      { children }
    </Wrapper>
  )
}

const Wrapper = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #000000;
`

export default Title
