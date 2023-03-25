import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { FormState } from 'final-form';
import { FormSpy, useForm } from 'react-final-form';
import { FocusableInput, getFormInputs } from 'final-form-focus';

type InputsRecord = Record<string, FocusableInput>;
const getFormInputsRecord = (formName: string): InputsRecord => {
  const getInputs = getFormInputs(formName);
  return getInputs().reduce((res, input) => {
    return { ...res, [input.name]: input };
  }, {} as InputsRecord);
};

interface Props {
  formName: string;
  blocks?: Record<string, string[]>;
}

export const FormSpyErrors = ({ formName, blocks }: Props) => {
  const form = useForm();
  const { push } = useRouter();
  const handleChange = useCallback(({ errors, submitFailed, dirtySinceLastSubmit }: FormState<any>) => {
    if (submitFailed && !dirtySinceLastSubmit && errors) {
      const formInputs = form.getRegisteredFields();
      const focusableInputs = getFormInputsRecord(formName);
      const targetField = formInputs.find((name) => !!errors[name]);
      const targetFieldFocusable = formInputs.find((name) => !!errors[name] && !!focusableInputs[name]);
      // DnD блокирует фокус
      if (
        targetFieldFocusable &&
        targetFieldFocusable !== 'modification' &&
        targetFieldFocusable !== 'imagesExterior'
      ) {
        focusableInputs[targetFieldFocusable].focus();
      } else if (targetField && blocks) {
        const targetBlock = Object.keys(blocks).find((blockId) => blocks[blockId].includes(targetField));
        if (targetBlock) {
          push({ hash: targetBlock }, undefined, { shallow: true });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FormSpy subscription={{ errors: true, submitFailed: true, dirtySinceLastSubmit: true }} onChange={handleChange} />
  );
};
