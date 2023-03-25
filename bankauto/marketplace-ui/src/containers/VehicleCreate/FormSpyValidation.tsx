import { useEffect, useMemo } from 'react';
import { Schema } from 'yup';
import { useFormState } from 'react-final-form';
import { makeValidateSync, ValidationError } from 'components/Fields/validation';

interface FormSpyValidationProps<Values extends {}> {
  schema: Schema<Values>;
  onValid?: () => void;
  onChange?: (isValid: boolean, errors: ValidationError) => void;
}

export const FormSpyValidation = <V extends {}>({ schema, onValid, onChange }: FormSpyValidationProps<V>) => {
  const { values } = useFormState<V>();
  const validation = useMemo(() => {
    return makeValidateSync(schema);
  }, [schema]);
  useEffect(() => {
    const err = validation(values);
    if (Object.keys(err).length) {
      if (onChange) {
        onChange(false, err);
      }
    } else {
      if (onChange) {
        onChange(true, err);
      }
      if (onValid) {
        onValid();
      }
    }
  }, [values, validation, onValid, onChange]);
  return null;
};
