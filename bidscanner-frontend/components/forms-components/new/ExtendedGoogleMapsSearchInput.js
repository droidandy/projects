// @flow
import React from 'react';
import styled from 'styled-components';

import { compose, withState } from 'recompose';
import { withApollo } from 'react-apollo';

import constructAddress from 'utils/constructAddress';

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

const SearchInputContainer = styled.div`
  text-align: center;
  width: 100%;
`;

type GoogleMapsSearchInputProps = {
  placeholder?: string,
  infoText?: string,
  input: InputProps,
};

// possible states of input value
// 1 - input.value = undefined,
//    *initial state
//    ->submit-error: required

// 2 - = {asString: present, asObject: absent},
//    *user started typing but haven't chosen anything yet
//    ->submit-error: please, choose your new address from the dropdown
//    *an error occured while requesting the data from APIs
//    ->local-error: message error from constructAddress function

// 3 - = {asString: absent, asObject: present},
//    *should be impossible

// 4 - = {asString: present, asObject: present},
//    *valid state

export default compose(
  withState('localError', 'setLocalError', null),
  withState('loading', 'setLoading', false),
  withApollo
)(
  ({
    infoText,
    placeholder,
    localError,
    setLocalError,
    meta: { touched, error },
    input,
    client,
    setLoading,
    loading,
  }: GoogleMapsSearchInputProps) => (
    <SearchInputContainer>
      <Container infoText={infoText}>
        {infoText && <InfoIcon text={infoText} />}
        <StyledPlacesAutocomplete
          options={{}}
          googleLogo={false}
          inputProps={{
            ...input,
            value: loading ? 'Loading...' : input.value.asString || '',
            onChange: addressString => {
              setLocalError(null);
              input.onChange({
                asObject: null,
                asString: addressString,
              });
            },
            placeholder,
          }}
          onSelect={async address => {
            setLoading(true);
            input.onChange({
              asObject: null,
              asString: address,
            });
            try {
              // trying to get valid address object
              const constructedAddress = await constructAddress(address, client);
              // if not an error, construct new value for form
              const newAddress = {
                asString: address,
                asObject: constructedAddress,
              };
              // update form
              input.onChange(newAddress);
              setLoading(false);
            } catch (err) {
              setLocalError(err.message);
              setLoading(false);
            }
          }}
        />
      </Container>
      {!loading && touched && error ? (
        <Error m={1}>{error}</Error>
      ) : (
        localError && <Error m={1}>{localError}</Error>
      )}
    </SearchInputContainer>
  )
);
