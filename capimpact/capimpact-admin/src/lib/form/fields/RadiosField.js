import React from 'react';
import { useField } from 'formik';
import { FormGroup, Label, FormFeedback, FormText, CustomInput } from 'reactstrap';

const RadiosField = ({ label, helperText, options = [], ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormGroup>
      {label && <Label for={props.id || props.name}>{label}</Label>}
      <div>
        {Array.from(options).map((option, index) => (
          <CustomInput
            key={index}
            type="radio"
            id={`${field.name}-${index}`}
            name={field.name}
            label={option.label}
            value={option.value}
            checked={field.value === option.value}
            onChange={field.onChange}
            {...props}
          />
        ))}
      </div>
      {meta.touched && meta.error ? <FormFeedback>{meta.error}</FormFeedback> : null}
      {helperText && <FormText>{helperText}</FormText>}
    </FormGroup>
  );
};

export default RadiosField;
