import React from 'react'
import styled from 'styled-components'

import { IconInformationOutline } from 'components/Icons'

import { Droppable } from '../lib/index'

const Fail = ({ onClick, className }) => (
  <Wrapper className={ className }>
    <FailBody>
      <IconWarning width="34px" height="34px" color="#ff0000" />
      <FailText>Something goes wrong</FailText>
    </FailBody>
    <LinkText onClick={ onClick }>
      Try again
    </LinkText>
  </Wrapper>
)

const Wrapper = styled(Droppable)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${props => props.height || 331}px;
  background-color: #f5f5f5;
  border: dotted 1px #a8a8b5;
  border-radius: 4px;
`

const IconWarning = styled(IconInformationOutline)`
  transform: rotate(180deg);
`

const FailBody = styled.div`
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const FailText = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #ff0000;
`

const LinkText = styled.div`
  margin-top:10px;
  font-size: 14px;
  color: #5389df;
  cursor: pointer;
  text-decoration: underline;
`

export default Fail
