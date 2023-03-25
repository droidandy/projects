// @flow
import React from 'react';
import styled from 'styled-components';

import type { InputProps } from 'redux-form';

import PlacesAutocomplete from 'react-places-autocomplete';
import InfoIcon from './InfoIcon';

const Container = styled.div`
  display: inline-block;
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

const Error = styled.span`
  color: #ff2929;
  font-size: 12px;
`;

const SearchInputContainer = styled.div`text-align: center;`;

type GoogleMapsSearchInputProps = {
  placeholder?: string,
  infoText?: string,
  input: InputProps,
};

export default ({
  infoText,
  placeholder,
  meta: { touched, error },
  input,
  onSelect,
}: GoogleMapsSearchInputProps) => (
  <SearchInputContainer>
    <Container infoText={infoText}>
      {infoText && <InfoIcon text={infoText} />}
      <StyledPlacesAutocomplete
        options={{}}
        googleLogo={false}
        inputProps={{ ...input, placeholder }}
        onSelect={address => {
          input.onChange(address);
          onSelect(address);
        }}
      />
    </Container>
    {touched && (error && <Error>{error}</Error>)}
  </SearchInputContainer>
);
