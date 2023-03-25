// @flow
import React from 'react';
import styled from 'styled-components';

import { Box } from 'grid-styled';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'components/forms-components/new/SelectField';
import Input from 'components/forms-components/new/Input';
import GoogleMapsSearchInput from 'components/forms-components/new/ExtendedGoogleMapsSearchInput';
import ImageDropzone from 'components/forms-components/new/Dropzone/Image';
import BlackButton from 'components/styled/BlackButton';
import MutedText from 'components/styled/MutedText';
import Error from 'components/styled/SimpleError';

const Container = styled.form`text-align: center;`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.75em;
  margin-bottom: 1em;
`;

const FieldBox = styled(Box).attrs({ mb: 1 })`
  text-align: left;
`;

export default ({ handleSubmit, submitting, error, companyTypes, businessTypes }) => (
  <Container onSubmit={handleSubmit}>
    <Title>New Company</Title>
    <FieldBox>
      <Field
        name="name"
        component={Input}
        type="text"
        placeholder="Company Name"
        infoText="Info about name field"
      />
    </FieldBox>
    <FieldBox>
      <Field
        name="companyType"
        component={SelectField}
        placeholder="Company Type"
        infoText="Info about this field"
      >
        {companyTypes &&
          companyTypes.map(type => <MenuItem key={type.id} value={type.id} primaryText={type.name} />)}
      </Field>
    </FieldBox>
    <FieldBox>
      <Field
        name="legalBusinessType"
        component={SelectField}
        placeholder="Legal Business Type"
        infoText="Info about this field"
      >
        {businessTypes &&
          businessTypes.map(type => <MenuItem key={type.id} value={type.id} primaryText={type.name} />)}
      </Field>
    </FieldBox>

    <FieldBox>
      <Field
        name="address"
        component={GoogleMapsSearchInput}
        placeholder="Company Address"
        infoText="Info about address field"
      />
    </FieldBox>
    <FieldBox>
      <Field
        name="website"
        component={Input}
        type="text"
        placeholder="Company Website"
        infoText="Info about website field"
      />
    </FieldBox>
    <FieldBox>
      <Field name="logo" component={ImageDropzone} infoText="Info about logo field" />
    </FieldBox>
    <Error p={1}>{error}</Error>
    <Box mt={3}>
      <BlackButton type="submit" disabled={submitting}>
        Create Company
      </BlackButton>
    </Box>
    <MutedText.Box px={3} mt={2}>
      By creating company you verify that you are the official representative of this company and have the
      right to act on behalf of the company in the creation of this page.
    </MutedText.Box>
  </Container>
);
