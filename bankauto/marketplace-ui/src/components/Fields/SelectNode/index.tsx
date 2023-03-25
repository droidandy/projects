import React from 'react';
import BaseSelect, { Props as BaseSelectProps } from 'components/Select/Select';
import { Field } from 'react-final-form';

export type SelectNodeOption = {
  id: number;
  name: string;
};

export interface SelectNodeProps extends Omit<BaseSelectProps, 'options' | 'value' | 'onBlur' | 'onChange'> {
  name: string;
  options?: SelectNodeOption[];
}

export const SelectNode = ({ name, options, disabled, ...rest }: SelectNodeProps) => (
  <Field name={name} type="select">
    {({ input, meta }) => {
      const variants: SelectNodeOption[] = options || meta.data?.options || [];
      const isDisabled = typeof disabled !== 'undefined' ? disabled : !variants.length;
      return (
        <BaseSelect
          {...rest}
          error={meta.touched && !!meta.error}
          name={input.name}
          value={input.value}
          onBlur={input.onBlur}
          onChange={input.onChange}
          options={variants.map((item) => ({ label: item.name, value: item.id }))}
          disabled={isDisabled}
        />
      );
    }}
  </Field>
);
