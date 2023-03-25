// @flow
import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';

import { Box, Flex } from 'grid-styled';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'components/forms-components/new/SelectField';
import Calendar from 'components/forms-components/new/Calendar';
import Input from 'components/forms-components/new/Input';
import Dropzone from 'components/forms-components/new/Dropzone';
import BlackButton from 'components/styled/BlackButton';
import MutedText from 'components/styled/MutedText';

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

export default ({ handleSubmit, certifications: cerfs, institutions: insts, submitting, error }) => {
  const certifications = get(cerfs, 'certifications.edges');
  const institutions = get(insts, 'institutions.edges');

  return (
    <Container onSubmit={handleSubmit}>
      <Title>Add Certificate</Title>
      <FieldBox>
        <Field
          name="certification"
          component={SelectField}
          placeholder="Certification"
          infoText="Info about files field"
        >
          {certifications &&
            certifications.map(v => <MenuItem key={v.id} value={v.id} primaryText={v.name} />)}
        </Field>
      </FieldBox>
      <FieldBox>
        <Field
          name="institution"
          component={SelectField}
          placeholder="Institution"
          infoText="Info about files field"
        >
          {institutions && institutions.map(v => <MenuItem key={v.id} value={v.id} primaryText={v.name} />)}
        </Field>
      </FieldBox>
      <FieldBox>
        <Box w={1 / 2} mr={1}>
          <Field
            name="issueDate"
            component={Calendar}
            placeholder="Issue Date"
            infoText="Info about this field"
          />
        </Box>
        <Box w={1 / 2}>
          <Field
            name="expiryDate"
            component={Calendar}
            placeholder="Expiry date"
            infoText="Info about this field"
          />
        </Box>
      </FieldBox>
      <FieldBox>
        <Field
          name="number"
          component={Input}
          type="text"
          placeholder="Certificate Number"
          infoText="Info about this field"
        />
      </FieldBox>
      <FieldBox>
        <Field name="files" component={Dropzone} infoText="Info about files field" />
      </FieldBox>
      <Error p={1}>{error}</Error>
      <Box mt={3}>
        <BlackButton type="submit" disabled={submitting}>
          Add Certificate
        </BlackButton>
      </Box>
      <MutedText.Box px={3} mt={2}>
        Copy about certificate here.
      </MutedText.Box>
    </Container>
  );
};
