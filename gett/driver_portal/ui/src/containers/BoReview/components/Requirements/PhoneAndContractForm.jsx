import React from 'react'
import styled from 'styled-components'

import { Form, PhoneField } from 'components/form'
import { Checkbox } from 'components/Checkbox'

class PhoneAndContractForm extends Form {
  state = {
    checked: false
  }

  validations = {
    gettPhone: 'phone'
  }

  save = this.save.bind(this)

  $render($) {
    const gettPhone = $('gettPhone')
    return (
      <Wrapper>
        <Title>Phone issued and contract singed</Title>
        <FormWrapper>
          <Row>
            <PhoneFieldStyled { ...gettPhone } value={ gettPhone.value === null ? '' : gettPhone.value } label="Gett phone number" placeholder="123456789" />
            <CheckboxWrapper>
              <Checkbox onClick={ this.save } checked={ this.props.checked } />
              <CheckBoxText>
                Driver signed contract
              </CheckBoxText>
            </CheckboxWrapper>
          </Row>
        </FormWrapper>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  display: flex;
  padding: 20px 0;
`

const Title = styled.div`
  flex: 1;
  margin: 25px 20px 0 0;
  color: #353a47;
  font-weight: bold;
`

const FormWrapper = styled.div`
  flex: 2;
`

const Row = styled.div`
  display: flex;
  align-items: flex-start;
`

const PhoneFieldStyled = styled(PhoneField)`
  flex: 1;
  margin-right: 20px;
`

const CheckboxWrapper = styled.div`
  flex: 1;
  display: flex;
  margin-top: 40px;
`

const CheckBoxText = styled.div`
  font-size: 14px;
  color: #000;
  margin-left: 10px;
`

export default PhoneAndContractForm
