// @flow
import React from 'react';
import styled from 'styled-components';

import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';
import MenuItem from 'material-ui/MenuItem';
import BlackButton from 'components/styled/BlackButton';
import DropdownMenu from 'components/forms-components/dropdowns/DropdownMenu';
import KeywordInput from 'components/forms-components/new/KeywordInput';
import ManufacturerInput from 'components/forms-components/new/ManufacturerInput';
import Input from 'components/forms-components/new/Input';
import InputWithParams from 'components/forms-components/new/InputWithParams';
import SelectField from 'components/forms-components/new/SelectField';
import Editor from 'components/forms-components/new/Editor';
import GoogleMapsSearchInput from 'components/forms-components/new/GoogleMapsSearchInput';
import Dropzone from 'components/forms-components/new/Dropzone';

const FieldBox = styled(Flex).attrs({ mb: props => (props.compact ? 1 : 2) })`
  width: 100%;
  max-width: 450px;
`;

export type GenerateFormProps = {
  categories: {}[],
  manufacturers: {}[],
};

export default ({ categories, manufacturers }: GenerateFormProps) =>
  <form>
    <FieldBox>
      <Field
        name="subcategories"
        component={KeywordInput}
        placeholder="Tag your Product"
        infoText="Info about tags field"
        categories={categories}
      />
    </FieldBox>
    <FieldBox>
      <Field
        name="title"
        component={Input}
        type="text"
        placeholder="Product Title"
        infoText="Info about title field"
      />
    </FieldBox>
    <FieldBox>
      <Field
        name="description"
        component={Editor}
        placeholder="Product Description"
        infoText="Info about description field"
      />
    </FieldBox>
    <FieldBox>
      <Field name="files" component={Dropzone} infoText="Info about files field" />
    </FieldBox>
    <FieldBox>
      <Field
        name="manufacturer"
        component={ManufacturerInput}
        manufacturers={manufacturers}
        placeholder="Manufactured by"
        infoText="Info about 'Manufactured by' field"
      />
    </FieldBox>
    <FieldBox>
      <Field
        name="pickupAddress"
        component={GoogleMapsSearchInput}
        placeholder="Pickup Location"
        infoText="Info about 'Pickup Location' field"
      />
    </FieldBox>
    <FieldBox>
      <Field name="price" component={InputWithParams} placeholder="Price" infoText="Info about 'Price' field">
        <DropdownMenu subfield="currency">
          <MenuItem value="USD" primaryText="USD" />
          <MenuItem value="EUR" primaryText="EUR" />
          <MenuItem value="GBP" primaryText="GBP" />
        </DropdownMenu>
        <DropdownMenu subfield="quantityType">
          <MenuItem value="pcs" primaryText="pcs" />
          <MenuItem value="kg" primaryText="kg" />
        </DropdownMenu>
      </Field>
    </FieldBox>
    <FieldBox>
      <Field
        name="inStock"
        component={InputWithParams}
        placeholder="In Stock"
        infoText="Info about 'In Stock' field"
      >
        <DropdownMenu subfield="quantityType">
          <MenuItem value="pcs" primaryText="pcs" />
          <MenuItem value="kg" primaryText="kg" />
        </DropdownMenu>
      </Field>
    </FieldBox>
    <FieldBox>
      <Field name="company" component={SelectField} placeholder="Choose company">
        <MenuItem value="1" primaryText="Company One" />
        <MenuItem value="2" primaryText="Another Company" />
        <MenuItem value="3" primaryText="Third Company" />
      </Field>
    </FieldBox>
    <Box mt={3}>
      <BlackButton type="Submit">Save Product</BlackButton>
    </Box>
  </form>;
