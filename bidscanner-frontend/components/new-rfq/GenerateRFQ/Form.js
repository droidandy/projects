// @flow
import React from 'react';
import styled from 'styled-components';

import addDays from 'date-fns/add_days';

import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';
import MenuItem from 'material-ui/MenuItem';
import BlackButton from 'components/styled/BlackButton';
import Input from 'components/forms-components/new/Input';
import KeywordInput from 'components/forms-components/new/KeywordInput';
import Checkbox from 'components/forms-components/new/Checkbox';
import SelectField from 'components/forms-components/new/SelectField';
import Calendar from 'components/forms-components/new/Calendar';
import Editor from 'components/forms-components/new/Editor';
import GoogleMapsSearchInput from 'components/forms-components/new/GoogleMapsSearchInput';
import Dropzone from 'components/forms-components/new/Dropzone';

const FieldBox = styled(Flex).attrs({ mb: props => (props.compact ? 1 : 2) })`
  width: 100%;
  max-width: 450px;
`;

const CalendarsWrapper = styled(Flex)`@media (max-width: 500px) {flex-direction: column;}`;

export type GenerateFormProps = {
  closingDate: Date,
  categories: any[],
};

export default ({ closingDate, categories }: GenerateFormProps) => (
  <form>
    <FieldBox>
      <Field
        name="subcategories"
        component={KeywordInput}
        placeholder="Tag your RFQ"
        infoText="Info about tags field"
        categories={categories}
      />
    </FieldBox>
    <FieldBox>
      <Field
        name="title"
        component={Input}
        type="text"
        placeholder="RFQ Title"
        infoText="Info about title field"
      />
    </FieldBox>
    <FieldBox>
      <Field
        name="description"
        component={Editor}
        placeholder="RFQ Description"
        infoText="Info about description field"
      />
    </FieldBox>
    <FieldBox>
      <Field name="files" component={Dropzone} infoText="Info about files field" />
    </FieldBox>
    <FieldBox direction="column">
      <CalendarsWrapper>
        <Box w={[1, 1 / 2]} mr={1} mt={[1, 0]}>
          <Field
            name="closingDate"
            component={Calendar}
            placeholder="Closing date"
            rangeStart={new Date()}
            infoText="Info about this field"
          />
        </Box>
        <Box w={[1, 1 / 2]} mt={[1, 0]}>
          <Field
            name="deliverByDate"
            component={Calendar}
            placeholder="Delivery date"
            rangeStart={closingDate ? addDays(closingDate, 1) : new Date()}
            infoText="Info about this field"
          />
        </Box>
      </CalendarsWrapper>
    </FieldBox>
    <FieldBox>
      <Field
        name="deliveryAddress"
        component={GoogleMapsSearchInput}
        placeholder="Ship to"
        infoText="Info about 'Ship to' field"
      />
    </FieldBox>
    <FieldBox>
      <Field name="company" component={SelectField} placeholder="Choose company">
        <MenuItem value="1" primaryText="Company One" />
        <MenuItem value="2" primaryText="Another Company" />
        <MenuItem value="3" primaryText="Third Company" />
      </Field>
    </FieldBox>
    <FieldBox compact>
      <Field
        name="estimate"
        component={Checkbox}
        label="Request for estimate"
        infoText="Info about 'Request for estimate' field"
      />
    </FieldBox>
    <FieldBox compact>
      <Field
        name="confidential"
        component={Checkbox}
        label="Confidential RFQ"
        infoText="Info about 'Confidential' field"
      />
    </FieldBox>
    <Box mt={3}>
      <BlackButton type="Submit">Preview RFQ</BlackButton>
    </Box>
    {/* <div className="mt-1">
      <Row>
        <Col md={{ size: 3, offset: 0 }} className="d-flex justify-content-end align-items-center" />
        <Col>
          <KeywordList keywords={keywords} />
        </Col>
      </Row>
    </div> */}
  </form>
);
