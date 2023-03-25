import * as React from 'react';
import styled from 'styled-components';
import { ObjectPerformance, KPIScoringSlug, KPIDataType } from 'src/types-next';
import { useTranslation } from 'react-i18next';
import { UnreachableCaseError } from 'src/common/helper';
import { formatKpiValue } from 'src/common/utils';

interface PerformancePopupProps {
  className?: string;
  performance: ObjectPerformance;
  trend: KPIScoringSlug;
  boundedGreenInside?: boolean;
  dataType: KPIDataType;
}

const _PerformancePopup = (props: PerformancePopupProps) => {
  const { className, trend, performance, boundedGreenInside, dataType } = props;
  const { t } = useTranslation();

  const formatValue = (value: number) => formatKpiValue(value, dataType);

  const renderPercent = () => {
    switch (trend) {
      case 'unscored': {
        return (
          <>
            <div>
              {t('Gray')} = {t('Any value')}
            </div>
          </>
        );
      }
      case 'as-target': {
        return (
          <>
            <div>
              {t('Green')} = {formatValue(100)}
            </div>
            <div>
              {t('Red')} != {formatValue(100)}
            </div>
          </>
        );
      }
      case 'bounded': {
        if (boundedGreenInside) {
          return (
            <>
              <div>
                {t('Green')} > {performance.lowThresholdPct} {t('AND')} {' < '}
                {formatValue(performance.highThresholdPct)}
              </div>
              <div>
                {t('Red')} {'<'} {performance.lowThresholdPct} {t('OR')} {' >'}
                {formatValue(performance.highThresholdPct)}
              </div>
            </>
          );
        } else {
          return (
            <>
              <div>
                {t('Green')} {'<'} {formatValue(performance.lowThresholdPct)}{' '}
                {t('OR')} {' >'}
                {formatValue(performance.highThresholdPct)}
              </div>
              <div>
                {t('Red')} > {formatValue(performance.lowThresholdPct)}{' '}
                {t('AND')} {' < '}
                {formatValue(performance.highThresholdPct)}
              </div>
            </>
          );
        }
      }
      case 'decreasing-better': {
        return (
          <>
            <div>
              {t('Red')} {'>='} {formatValue(performance.bestThresholdPct)}
            </div>
            <div>
              {t('Yellow')} {'>='} {formatValue(performance.targetThresholdPct)}
            </div>
            <div>
              {t('Green')} {'>='} {formatValue(performance.yellowThresholdPct)}
            </div>
            <div>
              {t('Blue')} {'<'} {formatValue(performance.yellowThresholdPct)}
            </div>
          </>
        );
      }
      case 'fixed-target':
      case 'quantitative':
      case 'increasing-better': {
        return (
          <>
            <div>
              {t('Red')} {'<'} {formatValue(performance.yellowThresholdPct)}
            </div>
            <div>
              {t('Yellow')} {'>='} {formatValue(performance.yellowThresholdPct)}
            </div>
            <div>
              {t('Green')} {'>='} {formatValue(performance.targetThresholdPct)}
            </div>
            <div>
              {t('Best')} {'>='} {formatValue(performance.bestThresholdPct)}
            </div>
          </>
        );
      }
      default:
        throw new UnreachableCaseError(trend);
    }
  };

  return <div className={className}>{renderPercent()}</div>;
};

export const PerformancePopup = styled(_PerformancePopup)`
  display: block;
  background: white;
  padding: 20px;
  border-radius: 4px;
`;
