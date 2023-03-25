/* @flow */
import React from 'react';
import styled from 'styled-components';

import type { MetaProps, InputProps } from 'redux-form';

import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import withRefs from 'utils/hoc/withRefs';

import Popover from 'material-ui/Popover';
import Menu from './Menu';
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
  displayValue: boolean,
  inputValue: string,
  menuDisplayed: boolean,
  setRef: string => any => void,
  refs: any,
  onInputChange: string => void,
  onInputFocus: () => void,
  onItemSelect: ({}) => void,
  onPopoverClose: () => void,
  handleAction: () => void,
};

type ExternalProps = {
  items: {}[],
  infoText?: string,
  className?: string,
  input?: InputProps,
  meta?: MetaProps,
  value?: any,
  onChange: any => void,
  getDisplayValue?: any => string,
  onAction?: () => void,
  actionText?: string,
  actionHint?: string,
};

const enhance = compose(
  withState('inputValue', 'setInputValue', ''),
  withState('menuDisplayed', 'setMenuDisplayed', false),
  withProps(props => ({
    value: props.input ? props.input.value : props.value,
    onChange: props.input ? props.input.onChange : props.onChange,
  })),
  withProps(props => ({
    displayValue: props.value ? props.getDisplayValue(props.value) : '',
  })),
  withRefs(),
  withHandlers({
    onInputChange: props => event => {
      props.setInputValue(event.target.value);
      props.onInputChange(event.target.value);
    },
    onInputFocus: props => () => {
      const { displayValue, setInputValue, setMenuDisplayed } = props;

      setInputValue(displayValue);
      setMenuDisplayed(true);
    },
    onItemSelect: props => selected => {
      const { onChange, setMenuDisplayed } = props;

      onChange(selected);
      setMenuDisplayed(false);
    },
    onPopoverClose: props => () => {
      const { setMenuDisplayed } = props;

      setMenuDisplayed(false);
    },
    handleAction: props => () => {
      const { onAction, setMenuDisplayed } = props;

      setMenuDisplayed(false);
      onAction();
    },
  })
);

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const {
    displayValue,
    infoText,
    setRef,
    refs,
    menuDisplayed,
    items,
    className,
    inputValue,
    getDisplayValue,
    onInputChange,
    onInputFocus,
    onItemSelect,
    onPopoverClose,
    handleAction,
    actionText,
    actionHint,
    ...restProps
  } = props;

  return (
    <Container className={className}>
      <InputContainer innerRef={setRef('anchor')} infoText={infoText}>
        {infoText && <InfoIcon text={infoText} />}
        <Input
          innerRef={setRef('input')}
          {...restProps}
          value={menuDisplayed ? inputValue : displayValue}
          onChange={onInputChange}
          onFocus={onInputFocus}
        />
      </InputContainer>
      <Popover
        open={menuDisplayed}
        anchorEl={refs.anchor}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        style={{ boxShadow: 'none', maxWidth: '450px' }}
        onRequestClose={onPopoverClose}
      >
        {inputValue.length > 0 ? (
          <Menu
            items={items}
            getDisplayValue={getDisplayValue}
            onSelect={onItemSelect}
            onAction={handleAction}
            actionText={actionText}
            actionHint={actionHint}
          />
        ) : (
          <EmptyHint>Start typing to see matches</EmptyHint>
        )}
      </Popover>
    </Container>
  );
});

export default EnhancedComponent;
