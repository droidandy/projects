import React, { FC } from 'react';
import { FieldProps, Field } from 'react-final-form';
import BaseAutocomplete from '../Autocomplete/Autocomplete';

const AutocompleteNew: FC<FieldProps<any, any> & any> = ({ name, multiple, options, ...rest }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        const empty = multiple ? [] : input.value;
        const value = multiple && ['array', 'object'].includes(typeof input.value) ? input.value : empty;
        return (
          <BaseAutocomplete
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
            name={input.name}
            value={value}
            handleBlur={input.onBlur}
            handleChange={input.onChange}
            onChange={(_, value) => input.onChange(value)}
            multiple={multiple}
            options={options || meta.data?.options || []}
            {...rest}
          />
        );
      }}
    </Field>
  );
};

export default AutocompleteNew;
