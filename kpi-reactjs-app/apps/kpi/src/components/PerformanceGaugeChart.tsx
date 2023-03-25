import Speedometer from 'react-d3-speedometer';
import * as React from 'react';
import styled from 'styled-components';
import { Card } from './Card';
import { Badge } from './Badge';
import { useTranslation } from 'react-i18next';
import { KPIScoringSlug, KPIDataType, ObjectPerformance } from 'src/types-next';
import { UnreachableCaseError } from 'src/common/helper';
import { colors, formatKpiValue, getKPIPercent } from 'src/common/utils';
import { MenuDropdown } from './MenuDropdown';
import { PerformancePopup } from './PerformancePopup';
import { TopBarItem } from './TopBar';
import { PerformanceColor } from 'src/components/PerformanceColor';

interface PerformanceGaugeChartProps {
  className?: string;
  trend: KPIScoringSlug;
  small?: boolean;
  boundedGreenInside?: boolean;
  performance: ObjectPerformance;
  prevPerformance: ObjectPerformance | null;
  dataType: KPIDataType;
}

function _mapRange(
  x: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function _mapIncreasingValue(
  value: number,
  best: number,
  target: number,
  yellow: number
) {
  if (value >= best) {
    return Math.min(_mapRange(value, best, best * 1.5, 75, 100), 95);
  }
  if (value >= target) {
    return _mapRange(value, target, best - 1, 50, 74);
  }
  if (value >= yellow) {
    return _mapRange(value, yellow, target - 1, 25, 49);
  }
  return Math.max(_mapRange(value, 0, yellow - 1, 0, 24), 5);
}

function _mapBoundedValue(value: number, low: number, hight: number) {
  if (value >= hight) {
    return Math.min(_mapRange(value, hight, 2 * hight, 75, 100), 95);
  }
  if (value >= low) {
    return _mapRange(value, low, hight, 50, 74);
  }
  return Math.max(_mapRange(value, 0, low - 1, 0, 24), 5);
}

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 260px;
  margin: 0 auto;

  div:nth-child(1) {
    width: 50px;
    text-align: left;
  }
  div:nth-child(2) {
    width: 130px;
    text-align: center;
  }
  div:nth-child(3) {
    width: 50px;
    text-align: right;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  ${Badge} {
    margin-left: auto;
    padding: 1rem;
    font-size: 1.3rem;
  }
`;

const Label = styled.div`
  font-size: 1.1rem;
  strong {
    display: block;
    font-size: 1.6rem;
  }
`;

const DropdownWrapper = styled.div`
  display: flex;
  ${TopBarItem} {
    margin-left: 10px;
    align-items: center;
    cursor: pointer;
  }
`;

function _sign(n: number) {
  return n > 0 ? '+' : n < -1 ? '-' : '';
}

const _PerformanceGaugeChart = (props: PerformanceGaugeChartProps) => {
  const {
    className,
    trend,
    performance,
    prevPerformance,
    small,
    boundedGreenInside,
    dataType,
  } = props;

  const format = (percent: number) =>
    formatKpiValue(
      getKPIPercent(percent, performance.aggregatedTarget),
      dataType
    );

  const hasValue = performance != null;
  const colorValue =
    hasValue && performance.performanceColor != null
      ? performance.performanceColor.slug
      : colors.gray;
  const { t } = useTranslation();
  const getSpeedometerProps = () => {
    const getValue = (percent: number | null) =>
      getKPIPercent(percent, performance.aggregatedTarget)!;

    if (!hasValue) {
      return {
        customSegmentStops: [0, 100],
        value: 50,
        segmentColors: [colors.gray],
      };
    }
    switch (trend) {
      case 'unscored': {
        return {
          customSegmentStops: [0, 100],
          value: 50,
          segmentColors: [colors.gray],
        };
      }
      case 'as-target': {
        return {
          customSegmentStops: [0, 50, 100],
          value:
            performance.aggregatedTarget === performance.aggregatedValue
              ? 75
              : 25,
          segmentColors: [colors.red, colors.green],
        };
      }
      case 'bounded': {
        return {
          customSegmentStops: [0, 25, 75, 100],
          value: _mapBoundedValue(
            performance.aggregatedValue,
            getValue(performance.lowThresholdPct),
            getValue(performance.highThresholdPct)
          ),
          segmentColors: boundedGreenInside
            ? [colors.red, colors.green, colors.red]
            : [colors.green, colors.red, colors.green],
        };
      }
      case 'decreasing-better': {
        return {
          customSegmentStops: [0, 25, 50, 75, 100],
          value: _mapIncreasingValue(
            performance.aggregatedValue,
            getValue(performance.bestThresholdPct),
            getValue(performance.targetThresholdPct),
            getValue(performance.yellowThresholdPct)
          ),
          segmentColors: [colors.red, colors.yellow, colors.green, colors.blue],
        };
      }
      case 'fixed-target':
      case 'quantitative':
      case 'increasing-better': {
        return {
          customSegmentStops: [0, 25, 50, 75, 100],
          value: _mapIncreasingValue(
            performance.aggregatedValue,
            getValue(performance.bestThresholdPct),
            getValue(performance.targetThresholdPct),
            getValue(performance.yellowThresholdPct)
          ),
          segmentColors: [colors.red, colors.yellow, colors.green, colors.blue],
        };
      }
      default:
        throw new UnreachableCaseError(trend);
    }
  };

  const getLowValue = () => {
    switch (trend) {
      case 'unscored': {
        return null;
      }
      case 'as-target': {
        return (
          <>
            {format(0)}
            <br />
            {t('Red')}
          </>
        );
      }
      case 'bounded': {
        return (
          <>
            {format(performance.lowThresholdPct)}
            <br />
            {t('Red')}
          </>
        );
      }
      case 'decreasing-better': {
        return (
          <>
            {format(performance.bestThresholdPct)}
            <br />
            {t('Red')}
          </>
        );
      }
      case 'fixed-target':
      case 'quantitative':
      case 'increasing-better': {
        return (
          <>
            {format(performance.yellowThresholdPct)}
            <br />
            {t('Red')}
          </>
        );
      }
      default:
        throw new UnreachableCaseError(trend);
    }
  };

  const getTargetValue = () => {
    switch (trend) {
      case 'unscored': {
        return null;
      }
      case 'as-target': {
        return (
          <>
            {format(100)}
            <br />
            {t('Target')}
          </>
        );
      }
      case 'bounded': {
        return (
          <>
            {format(performance.highThresholdPct)}
            <br />
            {t('Target')}
          </>
        );
      }
      case 'decreasing-better': {
        return (
          <>
            {format(performance.targetThresholdPct)}
            <br />
            {t('Target')}
          </>
        );
      }
      case 'fixed-target':
      case 'quantitative':
      case 'increasing-better': {
        return (
          <>
            {format(performance.targetThresholdPct)}
            <br />
            {t('Target')}
          </>
        );
      }
      default:
        throw new UnreachableCaseError(trend);
    }
  };

  const getPercentDiff = () => {
    if (
      !hasValue ||
      prevPerformance == null ||
      prevPerformance.aggregatedValue == null ||
      prevPerformance.aggregatedValue === 0
    ) {
      return null;
    }
    return Math.round(
      (performance.aggregatedValue / prevPerformance.aggregatedValue - 1) * 100
    );
  };
  const percentDiff = getPercentDiff();

  const getPercentColor = () => {
    if (!percentDiff) {
      return 'dark';
    }
    if (trend === 'decreasing-better') {
      return percentDiff > 0 ? 'error' : 'success';
    }
    return percentDiff > 0 ? 'success' : 'error';
  };

  const speedometerProps = getSpeedometerProps();
  return (
    <Card className={className}>
      <Top>
        <Label>
          <DropdownWrapper>
            {t('Performance')}
            {performance && (
              <MenuDropdown
                dropdown={
                  <PerformancePopup
                    performance={performance}
                    trend={trend}
                    boundedGreenInside={boundedGreenInside}
                    dataType={dataType}
                  />
                }
              >
                <i className="flaticon-exclamation-square" />
              </MenuDropdown>
            )}
          </DropdownWrapper>
          <strong>
            {hasValue ? (
              <PerformanceColor color={colorValue}>
                {performance.performance + '%'}
              </PerformanceColor>
            ) : (
              t('N/A')
            )}
          </strong>
        </Label>
        {percentDiff != null && (
          <Badge type={getPercentColor()} size="large">
            {percentDiff > 0 ? '+' : ''}
            {percentDiff}%
          </Badge>
        )}
      </Top>
      <Speedometer
        {...speedometerProps}
        width={small ? 200 : 300}
        height={small ? 110 : 160}
        minValue={0}
        maxValue={100}
        maxSegmentLabels={0}
        needleColor="black"
        currentValueText={''}
        ringWidth={10}
        key={hasValue ? 1 : 2}
      />
      {hasValue && (
        <Bottom style={{ width: small ? 180 : 260 }}>
          <div>{getLowValue()}</div>
          <div>
            {_sign(performance.performanceScore)}
            {performance.performanceScore}
            <br /> {t('Score')}
          </div>
          <div>{getTargetValue()}</div>
        </Bottom>
      )}
    </Card>
  );
};

export const PerformanceGaugeChart = styled(_PerformanceGaugeChart)`
  display: block;
  .pointer {
    display: ${props =>
      props.performance == null || props.performance.aggregatedValue == null
        ? 'none'
        : 'block'};
  }
`;
