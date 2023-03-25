import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TextArea = (props) => {
  const { className, label, value, onChange, error, ...rest } = props

  return (
    <Container className={ className }>
      { label && <Label>{ label }</Label> }
      <Input
        value={ value }
        onChange={ (e) => onChange(e.target.value, e) }
        { ...rest }
      />
      { error && <Error>{ error }</Error> }
    </Container>
  )
}

TextArea.propTypes = {
  onChange: PropTypes.func,
  error: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

TextArea.defaultProps = {
  value: ''
}

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
  min-height: 13px;
  font-size: 10px;
  font-weight: bold;
  text-align: left;
  color: #a9b1ba;
  margin-bottom: 5px;
  text-transform: uppercase;
`

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #f00;
  margin-top: 10px;
`

export default TextArea
