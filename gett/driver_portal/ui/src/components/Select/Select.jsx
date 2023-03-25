import React from 'react'
import styled, { css } from 'styled-components'
import { map } from 'lodash'
import { IconArrow } from 'components/Icons'

const Select = ({ onChange, selected, values, className, width, height, object, disabled }) => {
  let options = []
  if (object) {
    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        options.push(<option key={ `key${key}` } value={ key }>{ values[key] }</option>)
      }
    }
  } else {
    options = map(values, (value, index) => (
      <option key={ index } value={ value }>{ value }</option>
    ))
  }

  return (
    <Wrapper className={ className }>
      <Dropdown
        className={ className }
        width={ width }
        height={ height }
        onChange={ onChange }
        value={ selected }
        disabled={ disabled }>
        { options }
      </Dropdown>
      <Suffix>
        <IconArrow width="8" height="8" />
      </Suffix>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
`

const Dropdown = styled.select`
  margin: 0;
  padding-right: 16px;
  height: ${props => props.height ? props.height : 40}px;
  min-width: ${props => props.width ? props.width : 80}px;
  border-radius: 4px;
  background: #fff;
  border: solid 1px #a8a8b5;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  text-indent: 15px;
  appearance: none;
  
  ${props => !props.disabled && css`
    &:hover {
      border-color: #f6b530;
    }
  `}
  
  ${props => props.disabled && css`
    background-color: #ededed;
    border: solid 1px #a8a8b5;
    cursor: auto;
 `}
`

const Suffix = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 16px;
  margin: auto;
  width: 8px;
  height: 8px;
  padding: 0;
  transform: translateY(-40%);
  pointer-events: none;
  transform: rotate(-90deg);
`

export default Select
