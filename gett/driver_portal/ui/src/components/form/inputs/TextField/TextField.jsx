import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { media } from 'components/Media'

const TextField = (props) => {
  const { onChange, value, prefix, error, className, label, required, ...rest } = props

  return (
    <Container className={ className }>
      <Wrapper>
        {
          (label || required) &&
          <Labels>
            { label && <Label>{ label }</Label> }
            { required && <Asterix>*</Asterix> }
          </Labels>
        }
        { prefix && <Prefix>{ prefix }</Prefix> }
        <Input
          innerRef={ node => this.input = node }
          prefix={ prefix }
          onChange={ (e) => onChange(e.target.value, e) }
          value={ value }
          { ...rest }
        />
      </Wrapper>
      { error && <Error>{ error }</Error> }
    </Container>
  )
}

TextField.propTypes = {
  onChange: PropTypes.func,
  error: PropTypes.string,
  prefix: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  className: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

TextField.defaultProps = {
  value: ''
}

const Container = styled.div`
  margin: 10px 0px;
`

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const Labels = styled.div`
  display: flex;
  align-items: top;
  margin-bottom: 5px;
`

const Asterix = styled.span`
  color: red;
  margin-left: 5px;
  font-size: 14px;
  line-height: 12px;
`

const Label = styled.div`
  min-height: 13px;
  font-size: 10px;
  font-weight: bold;
  text-align: left;
  color: #a9b1ba;
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
  min-width: 100%;
  padding: 0px 10px;
  width: 100%;
  font-size: 14px;
  -webkit-appearance: none;
  
  ${props => props.prefix && css`
    min-width: 210px;
    padding-left: 56px;
  `}

  &::input-placeholder {
    font-size: 14px;
    text-align: left;
    color: #a8a8b5;
    font-weight: 300;
  }

  &:hover:enabled {
    border-color: #f6b530;
  }

  &:focus {
    outline: none;
    border-radius: 4px;
    border: 1px solid #f6b530;
  }

  ${media.phoneLarge`
    font-size: 16px;
  `}
`

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #f00;
  margin-top: 10px;
`

export default TextField
