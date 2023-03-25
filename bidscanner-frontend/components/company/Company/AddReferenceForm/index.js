// @flow
import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';

import { Box, Flex } from 'grid-styled';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import BlackButton from 'components/styled/BlackButton';
import DropdownMenu from 'components/forms-components/dropdowns/DropdownMenu';
import MutedText from 'components/styled/MutedText';
import Editor from 'components/forms-components/new/Editor';
import Input from 'components/forms-components/new/Input';
import InputWithParams from 'components/forms-components/new/InputWithParams';
import SelectField from 'components/forms-components/new/SelectField';

const Container = styled.form`text-align: center;`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.75em;
  margin-bottom: 1em;
`;

const FieldBox = styled(Flex).attrs({ mb: 1 })`
  text-align: left;
`;

const Error = styled(Box)`
  color: #ff2929;
  font-size: 12px;
`;

export default ({ handleSubmit, submitting, error, currencies: currns, countries: cntrs }) => {
  const currencies = get(currns, 'currencies.edges');
  const countries = get(cntrs, 'countries.edges');
  // console.log('currencies');
  // console.log(currencies);
  // console.log('countries');
  // console.log(countries);
  return (
    <Container onSubmit={handleSubmit}>
      <Title>Add Reference</Title>
      {/*
      <FieldBox>
        <Field
          name="customerName"
          component={Input}
          type="text"
          placeholder="Customer Name"
          infoText="Info about this field"
        />
      </FieldBox>
    */}
      <FieldBox>
        <Field
          name="projectName"
          component={Input}
          type="text"
          placeholder="Project Name"
          infoText="Info about this field"
        />
      </FieldBox>
      <FieldBox>
        <Field name="country" component={SelectField} placeholder="Country" infoText="Info about this field">
          {countries && countries.map(v => <MenuItem key={v.id} value={v.id} primaryText={v.name} />)}
        </Field>
      </FieldBox>
      <FieldBox>
        <Field
          name="description"
          component={Editor}
          placeholder="Project Description"
          infoText="Info about description field"
        />
      </FieldBox>
      <FieldBox>
        <Field
          name="year"
          component={Input}
          type="text"
          placeholder="Year"
          infoText="Info about this field"
        />
      </FieldBox>
      <FieldBox>
        <Field
          name="amount"
          component={InputWithParams}
          placeholder="Amount"
          infoText="Info about this field"
        >
          <DropdownMenu subfield="currency" placeholder="Currency">
            {currencies && currencies.map(v => <MenuItem key={v.id} value={v.id} primaryText={v.name} />)}
          </DropdownMenu>
        </Field>
      </FieldBox>
      <Error p={1}>{error}</Error>
      <Box mt={3}>
        <BlackButton type="submit" disabled={submitting}>
          Add Reference
        </BlackButton>
      </Box>
      <MutedText.Box px={3} mt={2}>
        Copy about reference here.
      </MutedText.Box>
    </Container>
  );
};
