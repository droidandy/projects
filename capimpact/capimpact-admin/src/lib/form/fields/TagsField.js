import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';
import CreatableSelect from 'react-select/creatable';
import { FormGroup, Label, FormFeedback, FormText } from 'reactstrap';

const TagsField = ({ label, helperText, options = [], FormGroupProps = {}, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);

  const selectValue = Array.from(field.value || []).map(tag => ({ label: tag, value: tag }));
  const selectOnChange = useCallback(
    value => {
      return setFieldValue(
        field.name,
        Array.from(value || []).map(it => it.value)
      );
    },
    [field, setFieldValue]
  );

  return (
    <FormGroup {...FormGroupProps}>
      {label && <Label for={props.id || props.name}>{label}</Label>}
      <CreatableSelect
        {...props}
        value={selectValue}
        onChange={selectOnChange}
        options={options}
        isMulti
      />
      {meta.error ? <FormFeedback style={{ display: 'block' }}>{meta.error}</FormFeedback> : null}
      {helperText && <FormText>{helperText}</FormText>}
    </FormGroup>
  );
};

export default TagsField;
