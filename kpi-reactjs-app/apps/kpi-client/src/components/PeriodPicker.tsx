import * as React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import { FrequencyPeriod, PeriodFrequency } from 'src/types';
import { MenuDropdown } from './MenuDropdown';
import { Select } from './Select';
import { measurementFrequencyOptions } from 'src/common/options';
import { SelectButton } from './SelectButton';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';
import { UnreachableCaseError } from 'shared/helper';
import { rtlMargin } from 'shared/rtl';
import { ArrowButton } from './ArrowButton';

const WIDTH = '220px';

interface PeriodPickerProps {
  start: number;
  end: number;
  className?: string;
  value: FrequencyPeriod;
  onChange: (value: FrequencyPeriod) => any;
  minFrequency: PeriodFrequency;
  maxFrequency?: PeriodFrequency;
  arrows?: boolean;
  width?: string;
  type?: 'filter';
}

const DropdownWrapper = styled.div`
  padding: 10px 15px;
`;

const PeriodWrapper = styled.div`
  margin-top: 15px;
  display: flex;
  & > div {
    flex: 1 0 auto;
  }
  & > div + div {
    ${rtlMargin('10px', '0')};
  }
`;

const ApplyButton = styled(Button)`
  display: flex;
  margin: 10px auto;
`;

const semiAnnuallyOptions = R.range(1, 3).map(h => ({
  value: h,
  label: `H${h}`,
}));
const quarterlyOptions = R.range(1, 5).map(q => ({ value: q, label: `Q${q}` }));
const monthlyOptions = R.range(1, 13).map(m => ({ value: m, label: `${m}` }));

function _getMaxPeriod(frequency: PeriodFrequency) {
  switch (frequency) {
    case 'Monthly':
      return 12;
    case 'Quarterly':
      return 4;
    case 'SemiAnnually':
      return 2;
    case 'Annually':
      return 0;
    default:
      throw new UnreachableCaseError(frequency);
  }
}

export function PeriodPicker(props: PeriodPickerProps) {
  const {
    onChange,
    start,
    end,
    minFrequency,
    maxFrequency,
    arrows,
    width,
    type,
  } = props;
  const { t } = useTranslation();

  const [value, setState] = React.useState(props.value);
  if (type) {
    React.useEffect(() => {
      setState(props.value);
    });
  }

  const yearOptions = React.useMemo(() => {
    return R.range(start, end + 1).map(year => ({ label: year, value: year }));
  }, [start, end]);

  const allowedFrequencyOptions = React.useMemo(() => {
    const end = measurementFrequencyOptions.findIndex(
      x => x.value === minFrequency
    );
    const start = measurementFrequencyOptions.findIndex(
      x => x.value === (maxFrequency || 'Annually')
    );
    return measurementFrequencyOptions.slice(start, end + 1);
  }, [minFrequency, maxFrequency]);

  const formatValue = () => {
    if (!props.value.frequency) {
      return null;
    }
    switch (props.value.frequency) {
      case 'Annually':
        return props.value.year;
      case 'SemiAnnually':
        return `H${props.value.periodNumber} - ${props.value.year}`;
      case 'Quarterly':
        return `Q${props.value.periodNumber} - ${props.value.year}`;
      case 'Monthly':
        return `${props.value.periodNumber}/${value.year}`;
      default:
        throw new UnreachableCaseError(props.value.frequency);
    }
  };

  const renderPeriodDropdown = () => {
    if (!value.frequency) {
      return null;
    }
    switch (value.frequency) {
      case 'Annually':
        return null;
      case 'SemiAnnually':
        return (
          <Select
            value={semiAnnuallyOptions.find(
              x => x.value === value.periodNumber
            )}
            options={semiAnnuallyOptions}
            onChange={(option: any) => {
              setState({
                ...value,
                periodNumber: option.value,
              });
              if (type) {
                onChange({
                  ...value,
                  periodNumber: option.value,
                });
              }
            }}
          />
        );
      case 'Quarterly':
        return (
          <Select
            value={quarterlyOptions.find(x => x.value === value.periodNumber)}
            options={quarterlyOptions}
            onChange={(option: any) => {
              setState({
                ...value,
                periodNumber: option.value,
              });
              if (type) {
                onChange({
                  ...value,
                  periodNumber: option.value,
                });
              }
            }}
          />
        );
      case 'Monthly':
        return (
          <Select
            value={monthlyOptions.find(x => x.value === value.periodNumber)}
            options={monthlyOptions}
            onChange={(option: any) => {
              setState({
                ...value,
                periodNumber: option.value,
              });
              if (type) {
                onChange({
                  ...value,
                  periodNumber: option.value,
                });
              }
            }}
          />
        );
      default:
        throw new UnreachableCaseError(value.frequency);
    }
  };

  return (
    <div
      style={{
        width: width || WIDTH,
        position: 'relative',
        background: 'white',
      }}
    >
      <MenuDropdown
        placement="bottom-end"
        width={width}
        dropdown={
          <DropdownWrapper style={{ width: width || WIDTH }}>
            <Select
              value={allowedFrequencyOptions.find(
                x => x.value === value.frequency
              )}
              options={allowedFrequencyOptions}
              onChange={(option: any) => {
                setState({
                  year: start,
                  periodNumber: 1,
                  ...value,
                  frequency: option.value,
                });
                if (type) {
                  onChange({
                    year: start,
                    periodNumber: 1,
                    ...value,
                    frequency: option.value,
                  });
                }
              }}
            />
            <PeriodWrapper>
              <Select
                value={yearOptions.find(x => x.value === value.year)}
                options={yearOptions}
                onChange={(option: any) => {
                  setState({
                    ...value,
                    year: option.value,
                  });
                  if (type) {
                    onChange({
                      ...value,
                      year: option.value,
                    });
                  }
                }}
              />
              {renderPeriodDropdown()}
            </PeriodWrapper>
            {!type && (
              <ApplyButton
                small
                onClick={e => {
                  onChange(value);
                  e.preventDefault();
                }}
              >
                {t('Apply')}
              </ApplyButton>
            )}
          </DropdownWrapper>
        }
      >
        {arrows ? (
          <ArrowButton
            onLeft={e => {
              e.preventDefault();
              e.stopPropagation();
              const newValue = { ...props.value };
              if (newValue.frequency === 'Annually') {
                if (newValue.year === start) {
                  return;
                }
                newValue.year--;
              } else {
                const maxPeriod = _getMaxPeriod(props.value.frequency);
                if (newValue.year === start && newValue.periodNumber === 1) {
                  return;
                }
                newValue.periodNumber--;
                if (newValue.periodNumber === 0) {
                  newValue.periodNumber = maxPeriod;
                  newValue.year--;
                }
              }
              setState(newValue);
              onChange(newValue);
            }}
            onRight={e => {
              e.preventDefault();
              e.stopPropagation();
              const newValue = { ...props.value };
              if (newValue.frequency === 'Annually') {
                if (newValue.year === end) {
                  return;
                }
                newValue.year++;
              } else {
                const maxPeriod = _getMaxPeriod(props.value.frequency);
                if (
                  newValue.year === end &&
                  newValue.periodNumber === maxPeriod
                ) {
                  return;
                }
                newValue.periodNumber++;
                if (newValue.periodNumber === maxPeriod + 1) {
                  newValue.periodNumber = 1;
                  newValue.year++;
                }
              }
              setState(newValue);
              onChange(newValue);
            }}
          >
            {formatValue()}
          </ArrowButton>
        ) : (
          <SelectButton>{formatValue()}</SelectButton>
        )}
      </MenuDropdown>
    </div>
  );
}
