import React from 'react'
import styled from 'styled-components'

const Preview = ({ children, dragEnter, dragLeave }) => (
  <Wrapper
    onDragEnter={ dragEnter }
    onDragLeave={ dragLeave }
    onDragEnd={ dragLeave }
  >
    {children}
  </Wrapper>
)

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${props => props.height || 331}px;
  border-radius: 4px;
`

export default Preview
