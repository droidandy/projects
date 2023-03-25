/* @flow */
import React from 'react';
import styled from 'styled-components';

import type { MetaProps, InputProps } from 'redux-form';

import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import withRefs from 'utils/hoc/withRefs';

import Popover from 'material-ui/Popover';
import ManufacturerMenu from './ManufacturerMenu';
import InfoIcon from '../InfoIcon';
// import Input from '../Input';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled.div`
  display: inline-flex;
  position: relative;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 0.25em ${props => (props.infoText ? '1.5em' : '1em')} 0.25em 1em;
  width: 100%;
`;

const Input = styled.input`
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
`;

const EmptyHint = styled.div`
  border: 1px solid #bcbec0;
  border-radius: 4px;
  background: white;
  padding: 8px 16px;
`;

type RecomposeProps = {
  inputValue: string,
  menuDisplayed: boolean,
  setRef: string => any => void,
  refs: any,
  onInputChange: string => void,
  onInputFocus: () => void,
  onManufacturerSelect: ({}) => void,
  onPopoverClose: () => void,
};

type ExternalProps = {
  manufacturers: {}[],
  infoText?: string,
  className?: string,
  pseudo?: boolean,
  input?: InputProps,
  meta?: MetaProps,
};

const enhance = compose(
  withState('inputValue', 'setInputValue', ''),
  withState('menuDisplayed', 'setMenuDisplayed', false),
  withHandlers({
    hideMenu: props => () => {
      const { input, setMenuDisplayed, setInputValue } = props;

      setMenuDisplayed(false);
      setInputValue(input.value ? input.value.name : '');
    },
    showMenu: props => () => {
      props.setMenuDisplayed(true);
    },
  }),
  withRefs(),
  withHandlers({
    onInputChange: props => event => {
      props.setInputValue(event.target.value);
    },
    onInputFocus: props => () => {
      props.setMenuDisplayed(true);
    },
    onManufacturerSelect: props => selected => {
      const { input, setMenuDisplayed, setInputValue } = props;

      input.onChange(selected);
      setMenuDisplayed(false);
      setInputValue(selected.name);
    },
    onPopoverClose: props => () => {
      const { input, setMenuDisplayed, setInputValue } = props;

      setMenuDisplayed(false);
      setInputValue(input.value ? input.value.name : '');
    },
  })
);

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const {
    infoText,
    setRef,
    refs,
    menuDisplayed,
    manufacturers,
    className,
    inputValue,
    onInputChange,
    onInputFocus,
    onManufacturerSelect,
    onPopoverClose,
    ...restProps
  } = props;

  return (
    <Container className={className}>
      <InputContainer innerRef={setRef('anchor')} infoText={infoText}>
        {infoText && <InfoIcon text={infoText} />}
        <Input
          innerRef={setRef('input')}
          {...restProps}
          value={inputValue}
          onChange={onInputChange}
          onFocus={onInputFocus}
        />
      </InputContainer>
      <Popover
        open={menuDisplayed}
        anchorEl={refs.anchor}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        style={{ boxShadow: 'none' }}
        onRequestClose={onPopoverClose}
      >
        {inputValue.length > 0
          ? <ManufacturerMenu manufacturers={manufacturers} onSelect={onManufacturerSelect} />
          : <EmptyHint>Start typing to see matches</EmptyHint>}
      </Popover>
    </Container>
  );
});

export default EnhancedComponent;
