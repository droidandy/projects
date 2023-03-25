import * as React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import { Table, Th, Td } from 'src/components/Table';
import { useTranslation } from 'react-i18next';
import {
  formatCalendarPeriod,
  getKPIPercent,
  formatKpiValue,
  isKPIScoring4Colors,
} from 'src/common/utils';
import { KPIScoringType, PeriodFrequency, KPICalendarPeriod } from 'src/types';
import { TrashIcon } from 'src/components/ReportsIcons';
import { KpiFormActions, getKpiFormState } from '../kpi-form';
import { useActions } from 'typeless';
import { FormInput } from 'src/components/ReduxInput';
import { UnreachableCaseError } from 'shared/helper';
import { FormSelect } from 'src/components/FormSelect';
import { Button } from 'src/components/Button';
import {
  KpiFormValues,
  getDataSeries,
  getDataSeriesProp,
} from 'src/common/kpi';
import { useScoringType, useDataType } from '../hooks';

interface KpiDataSeriesTableProps {
  className?: string;
}

function generateOptions(
  frequency: PeriodFrequency,
  year: number
): Array<{
  value: KPICalendarPeriod;
  label: React.ReactNode;
  filterName: PeriodFrequency;
}> {
  switch (frequency) {
    case 'Annually': {
      const value = {
        id: undefined,
        type: frequency,
        year,
        periodNumber: 0,
      };
      return [
        {
          value,
          label: formatCalendarPeriod(value),
          filterName: frequency,
        },
      ];
    }
    case 'SemiAnnually':
      return R.range(1, 3).map(half => {
        const value = {
          id: undefined,
          type: frequency,
          year,
          periodNumber: half,
        };
        return {
          value,
          label: formatCalendarPeriod(value),
          filterName: frequency,
        };
      });
    case 'Quarterly':
      return R.range(1, 5).map(quarter => {
        const value = {
          id: undefined,
          type: frequency,
          year,
          periodNumber: quarter,
        };
        return {
          value,
          label: formatCalendarPeriod(value),
          filterName: frequency,
        };
      });
    case 'Monthly':
      return R.range(1, 12).map(month => {
        const value = {
          id: undefined,
          type: frequency,
          year,
          periodNumber: month,
        };
        return {
          value,
          label: formatCalendarPeriod(value),
          filterName: frequency,
        };
      });
    default:
      throw new UnreachableCaseError(frequency);
  }
}

function usePeriodOptions(isEditing: boolean, values: KpiFormValues) {
  const frequency = values.frequency?.value;
  return React.useMemo(() => {
    if (!isEditing || !frequency) {
      return [];
    }
    const startYear = new Date().getFullYear() - 5;
    const endYear = new Date().getFullYear() + 5;
    const options = R.pipe(
      R.range(startYear, endYear + 1),
      R.flatMap(year => generateOptions(frequency, year))
    );
    if (frequency !== 'Annually') {
      const yearOptions = R.range(startYear, endYear + 1).map(
        year => generateOptions('Annually', year)[0]
      );
      options.unshift(...yearOptions);
    }
    return options;
  }, [isEditing, frequency]);
}

const _KpiDataSeriesTable = (props: KpiDataSeriesTableProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { change: changeInfo, changeMany } = useActions(KpiFormActions);
  const { values } = getKpiFormState.useState();
  const dataSeries = values.dataSeries || [];
  const isEditing = true;
  const periodOptions = usePeriodOptions(isEditing, values);
  const scoringType = useScoringType();
  const dataType = useDataType();

  return (
    <div className={className}>
      <Table>
        <thead>
          <tr>
            {isEditing && <Th />}
            <Th>{t('Period')}</Th>
            {isKPIScoring4Colors(scoringType) && (
              <>
                <Th>{t('Yellow')}</Th>
                <Th>{t('Green')}</Th>
                <Th>{t('Blue')}</Th>
              </>
            )}
            {KPIScoringType.Bounded === scoringType && (
              <>
                <Th>{t('Low')}</Th>
                <Th>{t('High')}</Th>
              </>
            )}
            <Th>{t('Target')}</Th>
          </tr>
        </thead>
        <tbody>
          {dataSeries.map(idx => {
            const item = getDataSeries(values, idx);
            const period = item.periodFrequency
              ? formatCalendarPeriod(item)
              : '';
            const getPercent = (n: number) =>
              formatKpiValue(getKPIPercent(n, item.target), dataType, true);

            const formatBounded = (n: number) => {
              if (n == null) {
                return '';
              }
              return Math.round(item.target * (100 + Number(n))) / 100;
            };
            return (
              <tr key={idx}>
                <Td style={{ width: 160 }}>
                  {!isEditing ? (
                    period
                  ) : (
                    <FormSelect
                      name={getDataSeriesProp(idx, 'periodFrequency')}
                      customValue={periodOptions.find(
                        x =>
                          x.value.periodNumber === item.periodNumber &&
                          x.value.type === item.periodFrequency &&
                          x.value.year === item.year
                      )}
                      options={periodOptions}
                      customOnChange={option => {
                        changeMany({
                          [getDataSeriesProp(idx, 'periodFrequency')]: option
                            .value.type,
                          [getDataSeriesProp(idx, 'year')]: option.value.year,
                          [getDataSeriesProp(idx, 'periodNumber')]: option.value
                            .periodNumber,
                        });
                      }}
                    />
                  )}
                </Td>
                {isKPIScoring4Colors(scoringType) && (
                  <>
                    <Td>{getPercent(values.yellow)}</Td>
                    <Td>{getPercent(values.target)}</Td>
                    <Td>{getPercent(values.best)}</Td>
                  </>
                )}
                {KPIScoringType.Bounded === scoringType && (
                  <>
                    <Td>{formatBounded(-values.low)}</Td>
                    <Td>{formatBounded(values.high)}</Td>
                  </>
                )}
                <Td>
                  {isEditing ? (
                    <FormInput
                      style={{ width: 100 }}
                      name={getDataSeriesProp(idx, 'target')}
                    />
                  ) : (
                    formatKpiValue(item.target, dataType)
                  )}
                </Td>
                {isEditing && (
                  <Td>
                    <a
                      onClick={() => {
                        changeInfo(
                          'dataSeries',
                          dataSeries.filter(x => x !== idx)
                        );
                      }}
                    >
                      <TrashIcon />
                    </a>
                  </Td>
                )}
              </tr>
            );
          })}
          {isEditing && (
            <tr>
              <Td colSpan={KPIScoringType.Bounded === scoringType ? 5 : 6}>
                <Button
                  styling="secondary"
                  onClick={() => {
                    changeInfo('dataSeries', [...dataSeries, Date.now()]);
                  }}
                >
                  + {t('Add New')}
                </Button>
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export const KpiDataSeriesTable = styled(_KpiDataSeriesTable)`
  display: block;
  margin-top: 20px;
`;
