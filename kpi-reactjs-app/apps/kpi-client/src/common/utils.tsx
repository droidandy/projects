import { ActionLike } from 'typeless';
import * as DateFns from 'date-fns';
import * as Rx from '../rx';
import ar from 'date-fns/locale/ar-SA';
import en from 'date-fns/locale/en-US';
import i18n from 'i18next';
import { GlobalActions } from '../features/global/interface';
import {
  KPICalendarPeriod,
  DataSeries,
  ObjectPerformance,
  ReportingCycle,
  KPIDataType,
  KPIScoringType,
  TransString,
} from 'src/types';
import { UnreachableCaseError } from 'shared/helper';
import React from 'react';
import { DisplayTransString } from 'src/components/DisplayTransString';

export const catchErrorAndShowModal = () =>
  Rx.catchLog<ActionLike, ActionLike>((e: any) => {
    console.error(e);
    const message = (e.response && e.response.Message) || e.message;
    return Rx.of(GlobalActions.showNotification('error', message));
  });

export function roundTo2(n: number) {
  return Math.round(n * 100) / 100;
}

export function formatDate(date: Date | string, withTime = false) {
  return DateFns.format(
    new Date(date),
    'MM/dd/yyyy' + (withTime ? ' hh:mm' : ''),
    {
      locale: i18n.language === 'ar' ? ar : en,
    }
  );
}

export function formatCalendarPeriod(
  period: KPICalendarPeriod | DataSeries | ObjectPerformance | ReportingCycle
) {
  const type =
    'periodAggregation' in period
      ? period.periodAggregation
      : 'type' in period
      ? period.type
      : period.periodFrequency;
  switch (type) {
    case 'Annually':
      return period.year.toString();
    case 'SemiAnnually':
      return `${period.year} - H${period.periodNumber}`;
    case 'Quarterly':
      return `${period.year} - Q${period.periodNumber}`;
    case 'Monthly':
      return `${period.year}/${period.periodNumber}`;
    default:
      throw new UnreachableCaseError(type);
  }
}

export function getKPIPercent(percent: number | null, target: number | null) {
  if (percent == null || target == null) {
    return null;
  }
  return Math.round((percent * target) / 100);
}

export function formatKpiValue(
  value: number | null | string,
  dataType: KPIDataType,
  useEmpty = false
) {
  if (value == null || value === '') {
    return useEmpty ? '' : 'N/A';
  }
  switch (dataType) {
    case KPIDataType.Percentage:
      return value + '%';
    case KPIDataType.Currency:
      return value + 'AED';
    default:
      return value;
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

const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const keyReg = /[^a-z_ ]/g;

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

export function isNullOrEmpty(str: string | number | null | undefined) {
  return str == null || str === '';
}

export function convertToOption<
  T extends { id: string | number; name: TransString }
>(item: T) {
  if (!item) {
    return null;
  }
  return {
    label: <DisplayTransString value={item.name} />,
    value: item.id,
  };
}

export function parseQueryString(qs: string | null | undefined) {
  return (qs || '')
    .replace(/^\?/, '')
    .split('&')
    .reduce((params, param) => {
      const [key, value] = param.split('=');
      if (key) {
        params[key] = value ? decodeURIComponent(value) : '';
      }
      return params;
    }, {} as Record<string, string>);
}
