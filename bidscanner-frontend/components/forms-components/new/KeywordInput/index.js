/* @flow */
import React from 'react';
import styled from 'styled-components';

import type { MetaProps, InputProps } from 'redux-form';

import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import withRefs from 'utils/hoc/withRefs';

import Popover from 'material-ui/Popover';
import CategoriesMenu from './KeywordMenu';
import SubcategoryList from './SubcategoryList';
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

type RecomposeProps = {
  inputValue: string,
  menuDisplayed: boolean,
  setRef: string => any => void,
  refs: any,
  onInputChange: string => void,
  onInputFocus: () => void,
  onSubcategorySelected: any => void,
  onSubcategoryRemove: string => void,
};

type ExternalProps = {
  categories: any[],
  infoText?: string,
  className?: string,
  pseudo?: boolean,
  input?: InputProps,
  meta?: MetaProps,
};

const enhance = compose(
  withState('inputValue', 'setInputValue', ''),
  withState('menuDisplayed', 'setMenuDisplayed', false),
  withRefs(),
  withHandlers({
    onInputChange: props => event => {
      const { setInputValue, setMenuDisplayed } = props;

      setInputValue(event.target.value);
      setMenuDisplayed(true);
    },
    onSubcategoryRemove: ({ input }) => removedId => {
      const newValue = input.value.filter(subcategory => subcategory.id !== removedId);

      input.onChange(newValue);
    },
    onSubcategorySelected: props => selected => {
      const { input, refs, setMenuDisplayed, setInputValue } = props;
      const exists = input.value.some(subcategory => subcategory.id === selected.id);

      if (!exists) {
        input.onChange([...input.value, selected]);
      }

      setMenuDisplayed(false);
      setInputValue('');
      refs.input.focus();
    },
  })
);

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const {
    input,
    infoText,
    setRef,
    refs,
    menuDisplayed,
    categories,
    className,
    inputValue,
    onInputChange,
    onInputFocus,
    onSubcategorySelected,
    onSubcategoryRemove,
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
      {input.value.length > 0 &&
        <SubcategoryList subcategories={input.value} onRemove={onSubcategoryRemove} />}
      <Popover
        open={menuDisplayed}
        anchorEl={refs.anchor}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        style={{ boxShadow: 'none' }}
      >
        <CategoriesMenu categories={categories} onSelect={onSubcategorySelected} />
      </Popover>
    </Container>
  );
});

export default EnhancedComponent;
