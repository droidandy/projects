import React from 'react';
import ReactSelect from 'react-select';
import { Theme } from 'react-select/src/types';
import ReactSelectCreatable, {
  Props as CreatableProps,
} from 'react-select/creatable';
import i18n from 'src/i18n';
import { Props } from 'react-select/src/Select';
import styled from 'styled-components';

export interface SelectProps<OptionType> extends Props<OptionType> {}
export interface CreatableSelectProps<OptionType>
  extends CreatableProps<OptionType> {}

const themeProp = (theme: Theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#9aabff',
    neutral20: '#dee1e9',
  },
});

const Label = styled.label`
  display: block;
  font-weight: 400;
  margin-bottom: 0.5rem;
`;

export function Select<T>(props: SelectProps<T>) {
  const { label, ...rest } = props;
  return (
    <>
      {label && <Label>{label}</Label>}
      <ReactSelect<T>
        {...rest}
        // menuPortalTarget={document.body}
        placeholder={rest.placeholder || i18n.t('Select...')}
        theme={themeProp}
      />
    </>
  );
}

export function CreatableSelect<T>(props: CreatableSelectProps<T>) {
  return (
    <ReactSelectCreatable<T>
      {...props}
      placeholder={props.placeholder || i18n.t('Select...')}
      theme={themeProp}
    />
  );
}
