import * as React from 'react';
import styled from 'styled-components';
import { FrequencyPeriod } from 'src/types';
import { PeriodPicker } from './PeriodPicker';

interface TablePeriodPickerProps {
  className?: string;
  period: FrequencyPeriod;
  changePeriod: (period: FrequencyPeriod) => any;
  type?: 'filter'
}

const _TablePeriodPicker = (props: TablePeriodPickerProps) => {
  const { className, period, changePeriod, type } = props;
  return (
    <div className={className}>
      <PeriodPicker
        arrows
        start={new Date().getFullYear() - 5}
        end={new Date().getFullYear()}
        value={period}
        minFrequency="Quarterly"
        onChange={changePeriod}
        type={type}
        width="100%"
      />
    </div>
  );
};

export const TablePeriodPicker = styled(_TablePeriodPicker)`
  display: flex;
  justify-content: flex-end;
`;
