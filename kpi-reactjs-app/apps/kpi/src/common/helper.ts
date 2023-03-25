import i18n from '../i18n';
import {
  KPIScoringType,
  AppStrategicMapColor,
  AppStrategicMapColors,
} from 'src/types-next';
import { isNullOrEmpty } from './utils';

const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const keyReg = /[^a-z0-9_ ]/g;

export function validateString(errors: any, values: any, name: string) {
  if (!values[name]) {
    errors[name] = 'This field is required!';
  }
}
export function validateBool(errors: any, values: any, name: string) {
  if (values[name] == null) {
    errors[name] = 'This field is required!';
  }
}
export function validateOption(errors: any, values: any, name: string) {
  if (values[name] == null) {
    errors[name] = 'This field is required!';
  }
}
export function validateDate(errors: any, values: any, name: string) {
  if (values[name] == null) {
    errors[name] = 'This field is required!';
  }
}
export function validateArray(errors: any, values: any, name: string) {
  if (!values[name] || !values[name].length) {
    errors[name] = 'Select at least one value!';
  }
}

export function validateEmail(errors: any, values: any, name: string) {
  if (values[name] && !emailReg.test(values[name])) {
    errors[name] = 'Invalid email!';
  }
}

export function validateMap(errors: any, values: any, name: string) {
  if (!values[name] || !Object.keys(values[name]).length) {
    errors[name] = 'Select at least one value!';
  }
}

export function validateNumber(
  errors: any,
  values: any,
  name: string,
  optional?: boolean
) {
  const noValue =
    values[name] == null ||
    (typeof values[name] === 'string' && values[name].trim() === '');
  if (noValue) {
    if (optional) {
      return;
    }
    errors[name] = 'This field is required!';
  } else if (isNaN(Number(values[name]))) {
    errors[name] = 'Invalid number!';
  }
}

export function validateMax(
  errors: any,
  values: any,
  name: string,
  max: number
) {
  if (errors[name] || isNullOrEmpty(values[name])) {
    return;
  }
  const n = Number(values[name]);
  if (n > max) {
    errors[name] = `Max value is ${max}`;
  }
}

export function validateMin(
  errors: any,
  values: any,
  name: string,
  min: number
) {
  if (errors[name] || isNullOrEmpty(values[name])) {
    return;
  }
  const n = Number(values[name]);
  if (n < min) {
    errors[name] = `Min value is ${min}`;
  }
}

export function validateLangString(errors: any, values: any, name: string) {
  const key = `${name}_${i18n.language}`;
  if (!values[key]) {
    errors[key] = 'This field is required!';
  }
}
export function validateLangDraft(errors: any, values: any, name: string) {
  const key = `${name}_${i18n.language}`;
  if (!values[key] || !values[key].getCurrentContent().hasText()) {
    errors[key] = 'This field is required!';
  }
}

export class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`);
  }
}

export function isKPIScoring4Colors(value: number) {
  return [
    KPIScoringType.Quantitative,
    KPIScoringType.DecreasingBetter,
    KPIScoringType.IncreasingBetter,
    KPIScoringType.FixedTarget,
  ].includes(value);
}

export function getDesignerItemStyle(
  type: AppStrategicMapColor,
  colors: AppStrategicMapColors
) {
  const color = colors[type];
  if (!colors[type]) {
    return {
      color: '#000',
      background: '#fff',
    };
  } else {
    return {
      color: color.font,
      background: color.background,
    };
  }
}
