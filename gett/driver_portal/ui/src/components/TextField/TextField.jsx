import React from 'react'
import styled, { css } from 'styled-components'
import { map, isEmpty } from 'lodash'
import { media } from '../Media'

const TextField = (props) => {
  const {
    value,
    type,
    onChange,
    prefix,
    placeholder,
    errors,
    className,
    label,
    disabled,
    responsive,
    autofocus
  } = props

  return (
    <Container className={ className }>
      <Wrapper>
        { label && <Label>{ label }</Label> }
        <Prefix>{ prefix }</Prefix>
        <Input
          innerRef={ node => this.input = node }
          type={ type }
          disabled={ disabled }
          prefix={ prefix }
          placeholder={ placeholder }
          onChange={ event => onChange && onChange(event.target.value) }
          value={ value }
          responsive={ responsive }
          autofocus={ autofocus }
        />
      </Wrapper>
      {
        !isEmpty(errors) && <Errors width={ this.input && this.input.clientWidth }>
          { map(errors, (error, index) => <Error key={ index }>{ error }</Error>) }
        </Errors>
      }
    </Container>
  )
}

const Container = styled.div`
  margin: 10px 0px;
`

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const Label = styled.div`
  width: 100%;
  height: 13px;
  font-size: 10px;
  font-weight: bold;
  text-align: left;
  color: #a9b1ba;
  margin-bottom: 5px;
  text-transform: uppercase;
`

const Prefix = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  left: 16px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Input = styled.input`
  height: 40px;
  border-radius: 4px;
  border: solid 1px #a8a8b5;
  min-width: ${props => props.responsive ? 'auto' : '210px'};
  padding: 0px 10px;
  width: 100%;
  font-size: 14px;
  -webkit-appearance: none;

  ${props => props.prefix && css`
    min-width: ${props => props.responsive ? 'auto' : '210px'};
    padding-left: 56px;
  `}

  &::input-placeholder {
    font-size: 14px;
    text-align: left;
    color: #a8a8b5;
    font-weight: 300;
  }
  ${props => !props.disabled && css`
    &:hover {
      border-color: #f6b530;
    }
  `}
  
  &:focus {
    outline: none;
    border-radius: 4px;
    border: 1px solid #f6b530;
  }
  
  ${media.phoneLarge`
    font-size: 16px;
  `}
  
`

const Errors = styled.div`
  margin-top: 5px;
  ${props => props.width && css`
    width: ${props.width}px;
  `}
`

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #ff0000;
`

export default TextField
