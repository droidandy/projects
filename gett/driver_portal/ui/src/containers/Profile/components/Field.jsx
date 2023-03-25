import React from 'react'
import styled from 'styled-components'

const Field = ({ label, value, valueUnder, className }) => {
  return value ? <Wrapper className={ className }>
    <Label>
      {label}
    </Label>
    <Value>
      {value}
    </Value>
    {valueUnder && <ValueUnder>
      {valueUnder}
    </ValueUnder>}
  </Wrapper> : null
}

const Label = styled.div`
  font-size: 10px;
  font-weight: bold;
  color: #a9b1ba;
  text-transform: uppercase;
`

const Value = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 19px;
  color: #303030;
  margin-top: 4px;
  word-wrap: break-word;
`

const ValueUnder = styled.div`
  font-size: 12px;
  color: #74818f;
  margin-top: 2px;
  word-wrap: break-word;
`

const Wrapper = styled.div`
  margin-top: 25px;
`

export default Field
