// @flow
import React from 'react';
import styled from 'styled-components';

import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';
import MenuItem from 'material-ui/MenuItem';
import BlackButton from 'components/styled/BlackButton';
import Input from 'components/forms-components/new/Input';
import InputWithParams from 'components/forms-components/new/InputWithParams';
import DropdownMenu from 'components/forms-components/dropdowns/DropdownMenu';
import Calendar from 'components/forms-components/new/Calendar';
import Editor from 'components/forms-components/new/Editor';
import Dropzone from 'components/forms-components/new/Dropzone';
import DeliveryLocation from 'components/forms-components/new/DeliveryLocation';

import MultipleSelect from 'components/forms-components/dropdowns/MultipleSelect';

const FieldBox = styled(Flex).attrs({ mb: props => (props.compact ? 1 : 2) })`
  width: 100%;
  max-width: 450px;
`;

export default () => (
  <form>
    <FieldBox>
      <Field
        name="title"
        component={Input}
        type="text"
        placeholder="Title"
        infoText="Info about title field"
        initialValue="RFQ: 5L Steel Seamless Pipes"
      />
    </FieldBox>
    <FieldBox>
      <Field
        name="price"
        component={InputWithParams}
        placeholder="Purchase Order Total Amount"
        infoText="Info about 'Price' field"
      >
        <DropdownMenu subfield="currency">
          <MenuItem value="USD" primaryText="USD" />
          <MenuItem value="EUR" primaryText="EUR" />
          <MenuItem value="GBP" primaryText="GBP" />
        </DropdownMenu>
      </Field>
    </FieldBox>
    <FieldBox>
      <Field
        name="quantity"
        component={Input}
        type="text"
        placeholder="Quantity"
        infoText="Info about quantity field"
      />
    </FieldBox>
    <FieldBox>
      <Field
        name="deliveryAddress"
        component={DeliveryLocation}
        placeholder="Delivery Location"
        infoText="Info about 'Ship to' field"
      />
    </FieldBox>
    <FieldBox>
      <Box w={1}>
        <Field
          name="deliverByDate"
          component={Calendar}
          placeholder="Delivery date"
          rangeStart={new Date()}
          infoText="Info about this field"
        />
      </Box>
    </FieldBox>
    <FieldBox>
      <Field
        name="comment"
        component={Editor}
        placeholder="Purchase Order Comments"
        infoText="Info about comments field"
      />
    </FieldBox>
    <FieldBox>
      <Field
        name="agreed-documents"
        component={MultipleSelect}
        title="Agreed Documents"
        options={['Some #1', 'Some #2', 'Some #3', 'Some #4']}
      />
    </FieldBox>
    <FieldBox>
      <Field name="files" component={Dropzone} infoText="Info about files field" />
    </FieldBox>
    <Box mt={'auto'}>
      <BlackButton type="Submit">Create Order</BlackButton>
    </Box>
  </form>
);
