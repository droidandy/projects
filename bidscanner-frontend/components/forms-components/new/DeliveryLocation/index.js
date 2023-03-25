// @flow
import React from 'react';
import styled from 'styled-components';

import MenuItem from 'material-ui/MenuItem';
import DropdownMenu from 'components/forms-components/dropdowns/DropdownMenu';

import PlacesAutocomplete from 'react-places-autocomplete';
import InfoIcon from '../InfoIcon';

const Container = styled.div`
  display: flex;
  position: relative;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 0.25em ${props => (props.infoText ? '1.5em' : '1em')} 0.25em 1em;
  width: 100%;
`;

const PlacesAutocompleteAdapter = ({ className, ...restProps }) => (
  <PlacesAutocomplete
    {...restProps}
    classNames={{
      root: className,
      input: 'PlacesInput',
      autocompleteContainer: 'PlacesContainer',
    }}
  />
);

const StyledPlacesAutocomplete = styled(PlacesAutocompleteAdapter)`
  .PlacesInput {
    position: relative;
    border: 0 none;
    background-color: transparent;
    width: 100%;
    padding: 0 1px;

    &:focus,
    &:active {
      outline: none;
    }

    &::placeholder {
      color: #bcbec0;
    }
  }

  .PlacesContainer {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin-top: 2px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    overflow: hidden;
    z-index: 100;
  }
`;

export default ({ infoText, placeholder, input }) => (
  <Container infoText={infoText}>
    <DropdownMenu
      value={input.value.incoterm}
      onChange={value => input.onChange({ ...input.value, incoterm: value })}
      placeholder="Incoterm"
    >
      <MenuItem value="EXW" primaryText="EXW" />
      <MenuItem value="CPT" primaryText="CPT" />
      <MenuItem value="ETC" primaryText="ETC" />
    </DropdownMenu>
    {infoText && <InfoIcon text={infoText} />}
    <StyledPlacesAutocomplete
      inputProps={{
        placeholder,
        value: input.value.value,
        onChange(value) {
          input.onChange({ ...input.value, value });
        },
      }}
    />
  </Container>
);
