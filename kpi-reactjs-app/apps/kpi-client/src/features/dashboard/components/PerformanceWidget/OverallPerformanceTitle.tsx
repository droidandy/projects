import * as React from 'react';
import styled from 'styled-components';
import { FrequencyPeriod } from 'src/types';

interface OverallPerformanceTitleProps {
  className?: string;
  percent: number;
  title: string;
  unit?: any;
  type?: string;
  period?: FrequencyPeriod;
}

const Percent = styled.span`
  position: absolute;
  top: 6px;
  left: 20px;
  font-style: normal;
  font-weight: 800;
  font-size: 30px;
  line-height: 38px;
  color: #10a6e9;
`;

const _OverallPerformanceTitle = (props: OverallPerformanceTitleProps) => {
  const { className, percent, title, unit, type, period } = props;
  let url: string = '';

  type === 'KPI'
    ? Object.keys({ ...unit, ...period }).forEach((key: string) => {
        switch (key) {
          case 'id':
            url = `units=${unit![key]}&`;
            break;
          case 'frequency':
            url = url + `periodFrequency=${period![key]}&`;
            break;
          case 'periodNumber':
            url = url + `periodNumber=${period![key]}&`;
            break;
          case 'year':
            url = url + `year=${period![key]}&`;
            break;
          default:
            break;
        }
      })
    : null;

  return (
    <div className={className}>
      <Percent>{percent}%</Percent>
      {type === 'KPI' ? (
        <a href={url ? `/kpi-reports?${url}` : '/kpi-reports'} target="_blank">
          <h5>{title}</h5>
        </a>
      ) : (
        <h5>{title}</h5>
      )}
    </div>
  );
};

export const OverallPerformanceTitle = styled(_OverallPerformanceTitle)`
  padding: 16px 20px;
  background: #ffffff;
  border-radius: 50px;
  position: relative;
  margin-bottom: 5px;
  h5 {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: #244159;
    margin: 0;
  }
`;
