import React, { FC } from 'react';
import { CheckboxMobile as MKPCheckboxMobile } from 'components/CheckboxMobile';
import { Field, FieldProps } from 'react-final-form';

const CheckboxMobile: FC<FieldProps<any, any> & any> = ({ name, label, ...rest }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <MKPCheckboxMobile
          error={meta.touched && !!meta.error}
          name={input.name}
          checked={input.value}
          label={label}
          onChange={(_, checked) => input.onChange(checked)}
          {...rest}
        />
      )}
    </Field>
  );
};

export default CheckboxMobile;
