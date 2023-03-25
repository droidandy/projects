import React from 'react';
import ReactSelect from 'react-select';
import { Theme } from 'react-select/src/types';
import ReactSelectCreatable, {
  Props as CreatableProps,
} from 'react-select/creatable';
import i18n from 'src/i18n';
import { Props } from 'react-select/src/Select';
import { Option } from 'react-select/src/filters';

export interface SelectProps<OptionType> extends Props<OptionType> {}
export interface CreatableSelectProps<OptionType>
  extends CreatableProps<OptionType> {}

const themeProp = (theme: Theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#9aabff',
  },
});

export function Select<T>(props: SelectProps<T>) {
  const customFilter = (option: Option, inputValue: string): boolean => {
    const {
      value: optionValue,
      data: { filterName },
    } = option;
    const value = inputValue.toLowerCase();

    return typeof optionValue === 'string'
      ? optionValue.toLowerCase().includes(value)
      : !!filterName
      ? filterName.toLowerCase().includes(value)
      : value === '';
  };

  return (
    <ReactSelect<T>
      {...props}
      //menuPortalTarget={document.body}
      placeholder={props.placeholder || i18n.t('Select...')}
      theme={themeProp}
      filterOption={customFilter}
    />
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
