import { PeriodFrequency } from 'src/types-next';
import React, { useContext } from 'react';
import { PeriodPicker } from './PeriodPicker';
import { FormContext } from 'typeless-form';
import styled from 'styled-components';
import { ErrorMessage } from './ErrorMessage';
import { useTranslation } from 'react-i18next';

export interface FormPeriodPickerProps {
  name: string;
  start: number;
  end: number;
  minFrequency: PeriodFrequency;
  readOnlyText: boolean;
}

const Wrapper = styled.div`
  width: 100%;
`;

export function FormPeriodPicker(props: FormPeriodPickerProps) {
  const { name, start, end, minFrequency } = props;
  const data = useContext(FormContext);
  if (!data) {
    throw new Error(`${name} cannot be used without FormContext`);
  }
  const { t } = useTranslation();
  const hasError = data.touched[name] && !!data.errors[name];

  const getValue = (prop: 'frequency' | 'year' | 'number') =>
    data.values[`${name}_${prop}`];

  return (
    <Wrapper>
      <PeriodPicker
        start={start}
        end={end}
        value={{
          frequency: getValue('frequency'),
          year: getValue('year'),
          periodNumber: getValue('number'),
        }}
        onChange={option => {
          data.actions.change(`${name}_frequency`, option.frequency);
          data.actions.change(`${name}_year`, option.year);
          data.actions.change(`${name}_number`, option.periodNumber);
        }}
        minFrequency={minFrequency}
      />
      {hasError && <ErrorMessage>{t(data.errors[name])}</ErrorMessage>}
    </Wrapper>
  );
}
