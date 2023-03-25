import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';
import Select from 'react-select';
import { FormGroup, Label, FormFeedback, FormText } from 'reactstrap';

const SelectField = ({
  label,
  helperText,
  options = [],
  FormGroupProps = {},
  handleChange,
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);

  const selectValue = options.find(option => option.value === field.value) || {};
  const selectOnChange = useCallback(
    value => {
      setFieldValue(field.name, value && value.value);
      if (handleChange) {
        handleChange({ field, meta, option: value, value: value && value.value });
      }
    },
    [handleChange, field, meta, setFieldValue]
  );

  return (
    <FormGroup {...FormGroupProps}>
      {label && <Label for={props.id || props.name}>{label}</Label>}
      <Select {...props} value={selectValue} onChange={selectOnChange} options={options} />
      {meta.error ? <FormFeedback style={{ display: 'block' }}>{meta.error}</FormFeedback> : null}
      {helperText && <FormText>{helperText}</FormText>}
    </FormGroup>
  );
};

export default SelectField;
