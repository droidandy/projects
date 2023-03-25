import React, { FC } from 'react';
import { FieldProps, Field } from 'react-final-form';
import { Select as BaseSelect } from '@marketplace/ui-kit';

const Select: FC<FieldProps<any, any> & any> = ({ name, ...rest }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <BaseSelect
          error={meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
          name={input.name}
          value={input.value}
          handleBlur={input.onBlur}
          handleChange={input.onChange}
          {...rest}
        />
      )}
    </Field>
  );
};

export default Select;
