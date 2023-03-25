import React, { useContext } from 'react';
import { FormContext } from 'typeless-form';
import { Input } from './Input';

interface FormInputProps {
  name: string;
  value?: any;
  type?: string;
  options?: Array<any>;
  placeholder?: string;
  showIndicators?: boolean;
  isMulti?: boolean;
  selectRange?: boolean;
  onChange?: (value: any) => any;
}

export const FormInput = (props: FormInputProps) => {
  const { name, onChange, ...rest } = props;
  const data = useContext(FormContext);
  const currentName = name.split('_')[0];
  const currentIndex = name.split('_')[1];

  if (!data) {
    throw new Error(`${name} cannot be used without FormContext`);
  }

  const hasError = (data.touched[currentName] || data.touched[name]) && !!data.errors[name];

  const updateValue = (value: any) => {
    if (currentIndex) {
      let current = [];
      if (data.values[currentName]) {
        current = data.values[currentName];
      }
      if (current[currentIndex] === value) return;
      current[currentIndex] = value;
      data.actions.change(
        currentName,
        current
      );
    }
    else {
      if (data.values[currentName] === value) return;
      data.actions.change(
        currentName,
        value
      );
    }
  }

  return (
    <Input
      name={name}
      data-error={hasError ? true : undefined}
      error={hasError ? true : false}
      onBlur={() => data.actions.blur(currentName)}
      onChange={value => ( onChange ? onChange(value) : updateValue(value) ) }
      {...rest}
    />
  );
};
