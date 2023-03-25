import React from 'react'
import styled from 'styled-components'
import { map, isEmpty } from 'lodash'

const TextArea = ({ className, label, value, rows, placeholder, onChange, errors }) => (
  <Container className={ className }>
    { label && <Label>{ label }</Label> }
    <Input
      rows={ rows }
      value={ value }
      onChange={ (event) => onChange(event.target.value) }
      placeholder={ placeholder }
    />
    {
      !isEmpty(errors) && <Errors>
        { map(errors, (error, index) => <Error key={ index }>{ error }</Error>) }
      </Errors>
    }
  </Container>
)

const Container = styled.div`
  position: relative;
  margin: 10px 0px;
`

const Input = styled.textarea`
  font-size: 14px;
  border: none;
  outline: 0;
  border-radius: 4px;
  border: solid 1px #a8a8b5;
  width: 100%;
  padding: 10px 15px;

  &::input-placeholder {
    font-size: 14px;
    text-align: left;
    color: #a8a8b5;
    font-weight: 300;
  }
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

const Errors = styled.div`
  margin-top: 5px;
`

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #ff0000;
`

export default TextArea
