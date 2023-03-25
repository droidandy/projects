import React from 'react'
import styled from 'styled-components'

import { Form, TextField } from 'components/form'
import { Button } from 'components/Button'

class VehicleDetailsForm extends Form {
  validations = {
    model: 'presence'
  }

  save = this.save.bind(this)

  $render($) {
    return (
      <Wrapper>
        <TitleRow>
          <Title>Vehicle details</Title>
          <Button onClick={ this.save }>Save details</Button>
        </TitleRow>
        <Row>
          <TextFieldStyled { ...$('model') } label="Vehicle Model" placeholder="Start typing" />
          <TextFieldStyled { ...$('color') } label="Vehicle Color" disabled />
          <TextFieldStyled { ...$('plateNumber') } label="Vehicle Registration Number" disabled />
        </Row>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  background: #fff;
  padding: 30px 30px 0;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #000;
`

const Row = styled.div`
  display: flex;
  margin-top: 15px;
  padding-bottom: 20px;
  border-bottom: 1px solid #d1d1d1;
`

const TextFieldStyled = styled(TextField)`
  flex: 1;
  margin-right: 25px;

  &:last-of-type {
    margin-right: 0;
  }
`

export default VehicleDetailsForm
