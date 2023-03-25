import React from 'react'
import styled, { css } from 'styled-components'
import { IconCheckMark } from 'components/Icons'

const Checkbox = ({ checked, onClick }) => (
  <Wrapper onClick={ e => e.stopPropagation() }>
    <Input
      type="checkbox"
      checked={ checked }
      onChange={ onClick }
    />
    <Tick
      color="#000000"
      checked={ checked }
      onClick={ onClick }
    />
  </Wrapper>
)

const Wrapper = styled.div`
  position: relative;
  width: 16px;
  height: 16px;
  margin: 0;
`

const Tick = styled(IconCheckMark)`
  position: absolute;
  left: 4px;
  top: 4px;
  display: none;

  ${props => props.checked && css`
    display: block;
  `}

  cursor: pointer;
`

const Input = styled.input`
  margin: 0;
  appearance: none;
  border-radius: 2px;
  border: solid 1px #ccd7e1;
  width: 16px;
  height: 16px;
  cursor: pointer;

  &:hover {
    border: solid 1px #fdb725;
  }

  ${props => props.checked && css`
    background-color: #fdb725
  `}
`

export default Checkbox
