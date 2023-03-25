import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';
import { FormGroup, Label, FormFeedback, FormText } from 'reactstrap';

import MultipleButtonGroup from 'components/MultipleButtonGroup';

const MultipleButtonGroupField = ({
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
      <MultipleButtonGroup
        {...props}
        value={selectValue}
        onChange={selectOnChange}
        options={options}
      />
      {meta.error ? <FormFeedback style={{ display: 'block' }}>{meta.error}</FormFeedback> : null}
      {helperText && <FormText>{helperText}</FormText>}
    </FormGroup>
  );
};

export default MultipleButtonGroupField;
