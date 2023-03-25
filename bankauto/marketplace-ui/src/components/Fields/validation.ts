// https://github.com/lookfirst/mui-rff/blob/master/src/Validation.ts
import { ReactNode } from 'react';
import { Schema, ValidateOptions, ValidationError as YupValidationError } from 'yup';
import set from 'lodash/set';
import get from 'lodash/get';

// Still seems buggy. https://stackoverflow.com/questions/63767199/typescript-eslint-no-unused-vars-false-positive-in-type-declarations
export type Translator = (errorObj: YupValidationError) => string | ReactNode;

export interface ValidationError {
  [key: string]: ValidationError | string;
}

function normalizeValidationError(err: YupValidationError, translator?: Translator): ValidationError {
  return err.inner.reduce((errors, innerError) => {
    const { path, message } = innerError;
    const el: ReturnType<Translator> = translator ? translator(innerError) : message;

    // eslint-disable-next-line no-prototype-builtins
    if (path && errors.hasOwnProperty(path)) {
      const prev = get(errors, path);
      prev.push(el);
      set(errors, path, prev);
    } else {
      set(errors, path, [el]);
    }
    return errors;
  }, {});
}
/**
 * Wraps the sync execution of a Yup schema to return an ValidationError
 * where the key is the form field and the value is the error string.
 */
export function makeValidateSync<T, C>(validator: Schema<T, C>, translator?: Translator, options?: ValidateOptions<C>) {
  return (values: T): ValidationError => {
    try {
      validator.validateSync(values, { abortEarly: false, ...options });
      return {};
    } catch (err) {
      return normalizeValidationError(err, translator);
    }
  };
}

/**
 * Uses the private _exclusive field in the schema to get whether or not
 * the field is marked as required or not.
 */
export function makeRequired<T>(schema: Schema<T>) {
  const { fields } = schema as any;
  return Object.keys(fields).reduce((accu, field) => {
    if (fields[field].fields) {
      // eslint-disable-next-line no-param-reassign
      accu[field] = makeRequired(fields[field]);
    } else {
      // eslint-disable-next-line no-param-reassign
      accu[field] = !!fields[field].exclusiveTests.required;
    }
    return accu;
  }, {} as any);
}
