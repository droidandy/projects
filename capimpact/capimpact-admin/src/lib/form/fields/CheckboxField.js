import React from 'react';
import { useField, useFormikContext } from 'formik';
import { FormGroup, Input, CustomInput, Label, FormFeedback, FormText } from 'reactstrap';

const CheckboxField = ({ label, helperText, FormGroupProps = {}, custom = false, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);

  const handleChange = event => {
    const { checked } = event.target;
    return setFieldValue(field.name, checked);
  };

  return custom ? (
    <FormGroup {...FormGroupProps}>
      <CustomInput
        type="checkbox"
        id={field.name}
        name={field.name}
        label={label}
        invalid={meta.touched && !!meta.error}
        checked={field.value === true}
        onChange={handleChange}
      />
      {meta.touched && meta.error ? <FormFeedback>{meta.error}</FormFeedback> : null}
      {helperText && <FormText>{helperText}</FormText>}
    </FormGroup>
  ) : (
    <FormGroup check {...FormGroupProps}>
      <Label check>
        <Input
          type="checkbox"
          {...field}
          {...props}
          invalid={meta.touched && !!meta.error}
          checked={field.value === true}
        />
        {label}
      </Label>
      {meta.touched && meta.error ? <FormFeedback>{meta.error}</FormFeedback> : null}
      {helperText && <FormText>{helperText}</FormText>}
    </FormGroup>
  );
};

export default CheckboxField;
