import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';
import Select from 'react-select';
import { FormGroup, Label, FormFeedback, FormText } from 'reactstrap';

const MultipleSelectField = ({
  label,
  helperText,
  options = [],
  FormGroupProps = {},
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);

  const selectValue = field.value || [];
  const selectOnChange = useCallback(
    value => {
      return setFieldValue(field.name, Array.from(value || []));
    },
    [field, setFieldValue]
  );

  return (
    <FormGroup {...FormGroupProps}>
      {label && <Label for={props.id || props.name}>{label}</Label>}
      <Select {...props} value={selectValue} onChange={selectOnChange} options={options} isMulti />
      {meta.error ? <FormFeedback style={{ display: 'block' }}>{meta.error}</FormFeedback> : null}
      {helperText && <FormText>{helperText}</FormText>}
    </FormGroup>
  );
};

export default MultipleSelectField;
