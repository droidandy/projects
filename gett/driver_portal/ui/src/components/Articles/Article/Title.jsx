import React from 'react'
import styled from 'styled-components'

const Title = ({ children, className }) => {
  return (
    <Wrapper className={ className }>
      { children }
    </Wrapper>
  )
}

const Wrapper = styled.div`
  overflow: hidden;
  display: block;
  display: -webkit-box;
  font-size: 16px;
  line-height: 1.5;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  height: 72px;
`

export default Title
