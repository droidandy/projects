import React from 'react'
import styled from 'styled-components'

import { media } from 'components/Media'
import { Form, TextField, AddressAutocomplete, Checkbox } from 'components/form'
import { IconInformation } from 'components/Icons'
import { Button } from 'components/Button'

class InfoForm2 extends Form {
  validations = {
    address: 'presence',
    sortCode: 'presence',
    accountNumber: 'presence',
    insuranceNumber: ['presence', 'isInsuranceNumber']
  }

  save = this.save.bind(this)

  $render($) {
    const insuranceNumberAgreement = $('insuranceNumberAgreement')
    const documentsAgreement = $('documentsAgreement')
    return (
      <Wrapper>
        <Label>
          Bank account information
        </Label>
        <InputWrapper>
          <TextFieldStyled { ...$('sortCode') } label="Sort code" placeholder="Start typing" />
          <TextFieldStyledRight { ...$('accountNumber') } label="Account number" placeholder="Start typing" />
        </InputWrapper>
        <Label>
          Address
        </Label>
        <AddressWrapper>
          <TextFieldAddress { ...$('city') } disabled label="City of residence" />
          <TextFieldAddressRight { ...$('postcode') } disabled label="Postcode" />
        </AddressWrapper>
        <AddressAutocompleteWrapper>
          <AddressAutocompleteStyled
            { ...$('address')(this.changeAddress) }
            placeholder="Start typing"
            label="Home address"
          />
        </AddressAutocompleteWrapper>
        <Label>
          National insurance number (NINo)
        </Label>
        <InputWrapper>
          <TextFieldStyled { ...$('insuranceNumber') } placeholder="Start typing" />
          <IconWrapper>
            <IconInformation />
            <IconText>
              You can find it in your personal tax account  or in letters from HMRC
            </IconText>
          </IconWrapper>
        </InputWrapper>
        <CheckboxWrapper>
          <Checkbox { ...insuranceNumberAgreement } />
          <CheckBoxText>
            I agree that Gett may use my National insurance number (NINO) to obtain driver license electronic counterpart from the DVLA
          </CheckBoxText>
        </CheckboxWrapper>
        { insuranceNumberAgreement.error && <Error>{ insuranceNumberAgreement.error }</Error> }
        <CheckboxWrapper>
          <Checkbox { ...documentsAgreement } />
          <CheckBoxText>
            By ticking this box I acknowledge that the documents I provide are genuine and legitimate and if they are not I understand Gett may report such issues to the relevant authorities
          </CheckBoxText>
        </CheckboxWrapper>
        { documentsAgreement.error && <Error>{ documentsAgreement.error }</Error> }
        <ButtonStyled onClick={ this.save }>
          Next Step
        </ButtonStyled>
      </Wrapper>
    )
  }

  changeAddress(value, geo) {
    const nextAttrs = { address: value, city: '', postcode: '' }

    if (geo) {
      const { city, postalCode: postcode } = geo
      Object.assign(nextAttrs, { city, postcode })
    }

    this.set(nextAttrs)
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 35px 0 20px;
  max-width: 560px;

  ${media.phoneLarge`
    min-width: 290px;
    margin: 0;
  `}
`

const Label = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #353a47;
`

const TextFieldStyled = styled(TextField)`
  min-width: 260px;
  margin: 30px 40px 40px 0;

  ${media.phoneLarge`
    margin: 15px 0 15px 0;
  `}
`

const TextFieldAddress = styled(TextField)`
  min-width: 260px;
  margin: 15px 40px 0 0;
  ${media.phoneLarge`
    margin-right: 0;
  `}
`

const TextFieldAddressRight = styled(TextFieldAddress)`
  margin-right: 0;
`

const TextFieldStyledRight = styled(TextFieldStyled)`
  margin-right: 0;
`

const InputWrapper = styled.div`
  display: flex;

  ${media.phoneLarge`
    flex-direction: column;
    margin-bottom: 40px;
  `}
`

const AddressAutocompleteStyled = styled(AddressAutocomplete)`
  min-width: 560px;

  ${media.phoneLarge`
    min-width: 0;
  `}
`

const AddressAutocompleteWrapper = styled.div`
  margin: 15px 0 40px;
`

const AddressWrapper = styled.div`
  display: flex;

  ${media.phoneLarge`
    flex-direction: column;
  `}
`

const ButtonStyled = styled(Button)`
  align-self: center;
  margin-top: 30px;

  ${media.phoneLarge`
    margin-bottom: 20px;
  `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 0 40px 0;

  ${media.phoneLarge`
    margin: 15px 0;
  `}
`

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 11px;

  ${media.phoneLarge`
    margin-top: 20px;
  `}
`

const CheckBoxText = styled.div`
  font-size: 14px;
  font-weight: normal;
  color: #303030;
  margin-left: 15px;
`

const IconText = styled.div`
  font-size: 14px;
  font-weight: normal;
  max-width: 220px;
  margin-left: 15px;
`

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #f00;
  margin-top: 10px;
`

export default InfoForm2
