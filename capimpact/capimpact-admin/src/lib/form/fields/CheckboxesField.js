import React from 'react';
import { useField, useFormikContext } from 'formik';
import { FormGroup, CustomInput, Label, FormFeedback, FormText } from 'reactstrap';

const CheckboxesField = ({ label, helperText, options = [], ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);

  const handleChange = event => {
    const value = Array.from(field.value || []);
    const { value: targetValue, checked } = event.target;
    if (checked) {
      return setFieldValue(field.name, value.concat(targetValue));
    }
    return setFieldValue(
      field.name,
      value.filter(v => v !== targetValue)
    );
  };

  return (
    <FormGroup>
      {label && <Label for={props.id || props.name}>{label}</Label>}
      <div>
        {Array.from(options).map((option, index) => (
          <CustomInput
            key={index}
            type="checkbox"
            id={`${field.name}-${index}`}
            name={field.name}
            label={option.label}
            value={option.value}
            checked={Array.from(field.value || []).includes(option.value)}
            onChange={handleChange}
          />
        ))}
      </div>
      {meta.touched && meta.error ? <FormFeedback>{meta.error}</FormFeedback> : null}
      {helperText && <FormText>{helperText}</FormText>}
    </FormGroup>
  );
};

export default CheckboxesField;
