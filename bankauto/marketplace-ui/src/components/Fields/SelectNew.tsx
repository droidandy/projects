import React, { FC } from 'react';
import { FieldProps, Field } from 'react-final-form';
import BaseSelect, { Props as SelectProps } from '../Select/Select';

const SelectNew: FC<FieldProps<SelectProps, any> & any> = ({ name, onBlur, onChange, options, ...rest }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        return (
          <BaseSelect
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
            name={input.name}
            value={input.value}
            onBlur={() => {
              onBlur?.();
              input.onBlur();
            }}
            onChange={(event) => {
              onChange?.(event.target.value);
              input.onChange(event);
            }}
            options={options || meta.data?.options || []}
            {...rest}
          />
        );
      }}
    </Field>
  );
};

export default SelectNew;
