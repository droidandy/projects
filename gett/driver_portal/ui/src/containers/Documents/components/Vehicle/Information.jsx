import React, { Component } from 'react'
import styled from 'styled-components'
import { media } from 'components/Media'
import { TextField } from 'components/TextField'

class Information extends Component {
  return
  render() {
    const { model, plateNumber, color } = this.props
    return (
      <Wrapper>
        <Title>Vehicle Information</Title>
        <Fields>
          <Field>
            <Label>
              Vehicle Model
            </Label>
            <TextField
              value={ model }
              disabled
            />
          </Field>
          <Field>
            <Label>
              Vehicle Color
            </Label>
            <TextField
              prefix={ <Color color="#a8a8b5" /> }
              value={ color }
              disabled
            />
          </Field>
          <Field>
            <Label>
              Car Plate
            </Label>
            <TextField
              value={ plateNumber }
              disabled
            />
          </Field>
        </Fields>
      </Wrapper>
    )
  }
}

const Title = styled.div`
  color: #000;
  font-size: 20px;
  font-weight: 500;
`

const Label = styled.div`
  font-size: 10px;
  font-weight: bold;
  color: #a9b1ba;
  text-transform: uppercase;
`

const Wrapper = styled.div`
  background: #fff;
  padding: 20px;
`

const Fields = styled.div`
  margin: 30px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  ${media.phoneLarge`
    flex-direction:column;
  `}
`

const Field = styled.div`
  flex: 1;
  margin: 0 10px;
  
  ${media.phoneLarge`
    min-width: 300px;
  `}
  
  ${media.phoneSmall`
    min-width: auto;
  `}
`

const Color = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${props => props.color}
`

export default Information
