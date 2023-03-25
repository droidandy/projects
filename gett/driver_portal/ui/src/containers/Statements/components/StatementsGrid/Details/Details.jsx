import React from 'react'
import styled from 'styled-components'
import { sizes } from 'components/Media'
import { Money } from 'components/Money'
import Field from './Field'
import Period from '../Period'

const Details = ({ statement }) => (
  <Wrapper>
    <Field visibleTill={ sizes.phoneLarge - 1 } label="Period">
      <Period from={ statement.from } to={ statement.to } />
    </Field>
    <Field visibleTill={ sizes.phoneLarge - 1 } label="Statement ID">
      { statement.id }
    </Field>
    <Field label="Rides">
      <Money value={ statement.rides } />
    </Field>
    <Field label="Tips">
      <Money value={ statement.tips } />
    </Field>
    <Field label="Adjustments">
      <Money value={ statement.adjustments } />
    </Field>
    <Field label="VAT">
      <Money value={ statement.vat } />
    </Field>
    <Field label="Commission">
      <Money value={ statement.commission } />
    </Field>
    <Field label="Cash">
      <Money value={ statement.cash } />
    </Field>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  padding: 20px;
  background-color: #ffffff;
  margin-bottom: 5px;
`

export default Details
