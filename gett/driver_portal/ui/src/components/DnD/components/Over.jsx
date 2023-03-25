import React from 'react'
import styled from 'styled-components'

import { IconDnD } from 'components/Icons'

import { Droppable } from '../lib/index'

const Over = ({ dragEnter, dragLeave, drop, className, types }) => (
  <Wrapper
    onDrop={ drop }
    onDragEnter={ dragEnter }
    onDragLeave={ dragLeave }
    onDragEnd={ dragLeave }
    className={ className }
    types={ types }>
    <IconDnD height={ 36 } width={ 40 } />
    <Text>
      Drag & Drop
    </Text>
    <Bottom>
      <TextBottom>your file here or</TextBottom>
      <LinkText>browse</LinkText>
    </Bottom>

  </Wrapper>
)

const Wrapper = styled(Droppable)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${props => props.height || 331}px;
  border: dotted 1px #a8a8b5;
  background-color: #f5f5f5;
  border-radius: 4px;
`

const LinkText = styled.div`
  margin-top:10px;
  font-size: 14px;
  color: #5389df;
  cursor: pointer;
  text-decoration: underline;
`

const Text = styled.div`
  font-size: 18px;
`

const Bottom = styled.div`
  display: flex;
  align-items: center;
`

const TextBottom = styled.div`
  margin-top:10px;
  margin-right:5px;
`

export default Over
