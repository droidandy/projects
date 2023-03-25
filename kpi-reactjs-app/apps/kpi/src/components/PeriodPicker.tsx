import * as React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import { FrequencyPeriod, PeriodFrequency } from 'src/types-next';
import { MenuDropdown } from './MenuDropdown';
import { UnreachableCaseError } from 'src/common/helper';
import { Select } from './Select';
import { measurementFrequencyOptions } from 'src/common/options';
import { SelectButton } from './SelectButton';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';

const WIDTH = 220;

interface PeriodPickerProps {
  start: number;
  end: number;
  className?: string;
  value: FrequencyPeriod;
  onChange: (value: FrequencyPeriod) => any;
  minFrequency: PeriodFrequency;
}

const DropdownWrapper = styled.div`
  padding: 10px 15px;
  width: ${WIDTH}px;
`;

const PeriodWrapper = styled.div`
  margin-top: 15px;
  display: flex;
  & > div {
    flex: 1 0 auto;
  }
  & > div + div {
    margin-left: 10px;
  }
`;

const ApplyButton = styled(Button)`
  display: flex;
  margin: 10px auto;
`;

const semiAnnuallyOptions = R.range(1, 3).map(h => ({
  value: h,
  label: `H${h}`,
  filterName: `H${h}`,
}));
const quarterlyOptions = R.range(1, 5).map(q => ({
  value: q,
  label: `Q${q}`,
  filterName: `Q${q}`,
}));
const monthlyOptions = R.range(1, 13).map(m => ({
  value: m,
  label: `${m}`,
  filterName: `${m}`,
}));

export function PeriodPicker(props: PeriodPickerProps) {
  const { onChange, start, end, minFrequency } = props;
  const { t } = useTranslation();

  const [value, setState] = React.useState(props.value);

  const yearOptions = React.useMemo(() => {
    return R.range(start, end + 1).map(year => ({
      label: year,
      value: year,
      filterName: `${year}`,
    }));
  }, [start, end]);

  const allowedFrequencyOptions = React.useMemo(() => {
    switch (minFrequency) {
      case 'Monthly':
        return measurementFrequencyOptions;
      case 'Quarterly':
        return measurementFrequencyOptions.slice(0, 3);
      case 'SemiAnnually':
        return measurementFrequencyOptions.slice(0, 2);
      case 'Annually':
        return measurementFrequencyOptions.slice(0, 1);
      default:
        throw new UnreachableCaseError(minFrequency);
    }
  }, [minFrequency]);

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
            }}
          />
        );
      default:
        throw new UnreachableCaseError(value.frequency);
    }
  };

  return (
    <div style={{ width: WIDTH }}>
      <MenuDropdown
        placement="bottom-end"
        dropdown={
          <DropdownWrapper>
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
                }}
              />
              {renderPeriodDropdown()}
            </PeriodWrapper>
            <ApplyButton
              small
              onClick={e => {
                onChange(value);
                e.preventDefault();
              }}
            >
              {t('Apply')}
            </ApplyButton>
          </DropdownWrapper>
        }
      >
        <SelectButton>{formatValue()}</SelectButton>
      </MenuDropdown>
    </div>
  );
}
