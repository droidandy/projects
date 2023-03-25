import React from 'react';
import { useField } from 'formik';
import { FormGroup, Input, Label, FormFeedback, FormText } from 'reactstrap';

const TextField = ({ label, helperText, FormGroupProps = {}, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormGroup {...FormGroupProps}>
      {label && <Label for={props.id || props.name}>{label}</Label>}
      <Input {...field} {...props} invalid={meta.touched && !!meta.error} />
      {meta.touched && meta.error ? <FormFeedback>{meta.error}</FormFeedback> : null}
      {helperText && <FormText>{helperText}</FormText>}
    </FormGroup>
  );
};

export default TextField;
