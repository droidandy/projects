import React from 'react'
import styled from 'styled-components'

import { Loader } from 'components/Loader'

import { Droppable } from '../lib/index'

const Load = ({ className }) => (
  <Wrapper className={ className }>
    <Loader color="#FDB924" />
  </Wrapper>
)

const Wrapper = styled(Droppable)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${props => props.height || 331}px;
  background-color: #f5f5f5;
  background-color: #f5f5f5;
  border: dotted 1px #a8a8b5;
  border-radius: 4px;
`

export default Load
