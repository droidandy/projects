import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

import { Form, SelectDropdown, Rate } from 'components/form'
import { Button } from 'components/Button'

const RIDES_VALUES = {
  0: '0-99',
  100: '100-199',
  200: '200-299',
  300: '300-399',
  400: '400-499',
  500: '500+'
}

class InfoForm extends Form {
  validations = {
    minRidesNumber: 'presence',
    otherRating: ['presence', (value) => {
      if (value && value > 5) {
        return 'The rating exceeds the maximum value of 5.00, please, re-enter'
      }
    }]
  }

  save = this.save.bind(this)

  $render($) {
    const { attrs } = this.props
    return (
      <Wrapper>
        <Label>
          How many rides have you done with another app?
        </Label>
        <RidesWrapper>
          <SelectDropdownStyled
            { ...$('minRidesNumber') }
            width={ 280 }
            selected={ RIDES_VALUES[attrs.minRidesNumber || 0] }
            values={ RIDES_VALUES }
            includeBlank
          />
        </RidesWrapper>
        <Label>
          What is your driver rating out of 5?
        </Label>
        <RateWrapper>
          <RateStyled { ...$('otherRating') } />
        </RateWrapper>
        <Label>
          What is your vehicle registration year?
        </Label>
        <SelectDropdownStyled
          { ...$('vehicleRegYear') }
          width={ 280 }
          selected={ attrs.vehicleRegYear }
          values={ this.yearValues }
          includeBlank
        />
        <ButtonStyled onClick={ this.save }>
          Next Step
        </ButtonStyled>
      </Wrapper>
    )
  }

  get yearValues() {
    const max = moment()

    let years = []
    let i = this.props.minYear
    while (moment(i, 'YYYY').isBefore(max)) {
      years.push(~~i)
      i = moment(i, 'YYYY').add(1, 'y').format('YYYY')
    }

    return years
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 35px 0 20px;
  max-width: 280px;
`

const RidesWrapper = styled.div`
  margin-bottom: 40px;
`

const Label = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #353a47;
`

const RateWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0 40px;
`

const RateStyled = styled(Rate)`
  width: 100%;
`

const SelectDropdownStyled = styled(SelectDropdown)`
  min-width: 280px;
  margin: 20px 0 0;
`

const ButtonStyled = styled(Button)`
  margin-top: 50px;
  align-self: center;
`

export default InfoForm
