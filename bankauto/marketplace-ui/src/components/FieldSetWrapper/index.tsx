import React, { PropsWithChildren, useMemo } from 'react';
import { Schema } from 'yup';
import { useFormState } from 'react-final-form';
import { FormControlBlock, FormControlBlockProps } from 'components/FormControlBlock';
import { makeValidateSync, ValidationError } from 'components/Fields/validation';

interface FormContainerProps<T> extends PropsWithChildren<FormControlBlockProps> {
  showValidationSchema?: Schema<T>;
}

export const FieldSetWrapper = <T extends {}>({
  children,
  showValidationSchema,
  show: propsShow = true,
  ...formControlBlockProps
}: FormContainerProps<T>) => {
  const { values } = useFormState<T>({ subscription: { values: true } });
  const validation = useMemo(() => {
    return showValidationSchema ? makeValidateSync(showValidationSchema) : null;
  }, [showValidationSchema]);
  const [show] = useMemo<[boolean, ValidationError | null]>(() => {
    const validationErrors = validation ? validation(values as T) : {};
    const hasErrors = Object.keys(validationErrors).length;
    return [Boolean(propsShow && !hasErrors), hasErrors ? validationErrors : null];
  }, [validation, values, propsShow]);
  return (
    <FormControlBlock show={show} {...formControlBlockProps}>
      {children}
    </FormControlBlock>
  );
};
