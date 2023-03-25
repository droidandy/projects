import React from 'react';
import * as R from 'remeda';
import { Table, Th, Td } from 'src/components/Table';
import { useTranslation } from 'react-i18next';
import { getScorecardsState } from '../interface';
import { useLanguage } from 'src/hooks/useLanguage';
import {
  getTrans,
  formatCalendarPeriod,
  getKpiPerformanceSuffix,
  formatKpiValue,
} from 'src/common/utils';
import { getGlobalState } from 'src/features/global/interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { measurementFrequencyOptions } from 'src/common/options';
import styled from 'styled-components';
import { useLoadUsers } from 'src/features/referencesNext/hooks';
import { getReferencesNextState } from 'src/features/referencesNext/interface';
import {
  Roles,
  TransString,
  ObjectPerformance,
  KpiMeasure,
  PeriodFrequency,
} from 'src/types-next';
import { Link } from 'src/components/Link';
import { PerformanceColor } from 'src/components/PerformanceColor';
import i18next from 'i18next';

const ID_COLUMN_WIDTH = 36;

const Scroll = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
  table {
    position: relative;
  }
  thead {
    th {
      top: 0;
      position: sticky;
    }
    th:nth-child(1) {
      width: ${ID_COLUMN_WIDTH}px;
      left: 0;
      z-index: 1;
    }
    th:nth-child(2) {
      left: ${ID_COLUMN_WIDTH}px;
      z-index: 1;
    }
  }
  tbody {
    td:nth-child(1) {
      width: ${ID_COLUMN_WIDTH}px;
      position: sticky;
      left: 0;
    }
    td:nth-child(2) {
      position: sticky;
      left: ${ID_COLUMN_WIDTH}px;
    }
  }
`;

const frequencySortOrder: { [x in PeriodFrequency]: number } = {
  Monthly: 1,
  Quarterly: 2,
  SemiAnnually: 3,
  Annually: 4,
};

function mapMeasureToPeriod(measure: KpiMeasure, t: i18next.TFunction) {
  return R.pipe(
    measure.performance,
    R.sort((a, b) => {
      if (a.periodAggregation !== b.periodAggregation) {
        return (
          frequencySortOrder[a.periodAggregation] -
          frequencySortOrder[b.periodAggregation]
        );
      }
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      if (a.periodNumber === b.periodNumber) {
        if (!a.progressAggregation || !b.progressAggregation) {
          return a.progressAggregation ? 1 : -1;
        }
      }
      return a.periodNumber - b.periodNumber;
    }),
    R.flatMap(item => {
      const period = formatCalendarPeriod(item);
      if (item.progressAggregation) {
        return [
          {
            key: `${period}_progress`,
            period: period + ' ' + t('Yearly Progress'),
            type: null,
            color: false,
          },
        ];
      }

      return [
        {
          key: period,
          period: period + ' ' + t('Value'),
          type: 'value' as const,
          color: false,
        },
        {
          key: period,
          period: period + ' ' + t('Target'),
          type: 'target' as const,
          color: false,
        },
        {
          key: period,
          period,
          type: null,
          color: true,
        },
      ];
    }),
    R.compact
  );
}

function normalizeMeasures(measures: KpiMeasure[]) {
  if (!measures) {
    return measures;
  }
  const anyQuarterly = measures.some(
    measure => measure.kpi.periodFrequency === 'Quarterly'
  );
  if (!anyQuarterly) {
    return measures;
  }
  return measures.map(measure => {
    if (measure.kpi.periodFrequency === 'SemiAnnually') {
      return {
        ...measure,
        performance: measure.performance.map(perf => ({
          ...perf,
          periodAggregation: 'Quarterly' as PeriodFrequency,
          periodNumber: perf.periodNumber * 2,
        })),
      };
    } else {
      return measure;
    }
  });
}

export function MeasuresTab() {
  useLoadUsers();
  const { users } = getReferencesNextState.useState();
  const { lookups, kpiLevels } = getGlobalState.useState();
  const { performance } = getScorecardsState.useState();
  const { t } = useTranslation();
  const lang = useLanguage();
  const lookupMap = React.useMemo(() => R.indexBy(lookups, x => x.id), [
    lookups,
  ]);
  const levelMap = React.useMemo(() => R.indexBy(kpiLevels, x => x.id), [
    kpiLevels,
  ]);

  const measures = React.useMemo(
    () => normalizeMeasures(performance.measures),
    [performance.measures]
  );

  const frequencyMap = React.useMemo(
    () =>
      measurementFrequencyOptions.reduce((ret, item) => {
        ret[item.value] = item.label;
        return ret;
      }, {} as any),
    [lookups]
  );

  const periods = React.useMemo(() => {
    const used: Record<string, boolean> = {};
    return R.pipe(
      measures,
      R.flatMap(measure => mapMeasureToPeriod(measure, t)),
      R.filter(item => {
        const key = `${item.key}_${item.type || ''}`;
        if (used[key]) {
          return false;
        }
        used[key] = true;
        return true;
      })
    );
  }, [measures, lang]);

  const { ownerMap } = React.useMemo(() => {
    if (!users.isLoaded) {
      return { ownerMap: {} };
    }
    const userMap = R.indexBy(users.users, x => x.id);
    const getUsers = (roles: Roles[]) =>
      measures.reduce((ret, item) => {
        ret[item.kpi.id] = item.kpi.userBscRoles
          .filter(x => roles.includes(x.roleId))
          .map(x => userMap[x.orgUserId] && userMap[x.orgUserId].name)
          .filter(x => x);
        return ret;
      }, {} as { [x: string]: TransString[] });
    return {
      ownerMap: getUsers([Roles.BscItemOwner]),
    };
  }, [measures, users]);

  const kpiPeriodMapping = React.useMemo(() => {
    const mapping = {} as {
      [x: string]: ObjectPerformance;
    };
    measures.forEach(measure => {
      measure.performance.forEach(item => {
        const period = formatCalendarPeriod(item);
        const key = `${measure.kpi.id}_${period}`;
        if (item.progressAggregation) {
          mapping[key + '_progress'] = item;
        } else {
          mapping[key] = item;
        }
      });
    });
    return mapping;
  }, [measures]);

  return (
    <Scroll>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>{t('Measure')}</Th>
            <Th>{t('Owners')}</Th>
            <Th>{t('Initiatives')}</Th>
            <Th>{t('Level')}</Th>
            <Th>{t('Frequency')}</Th>
            {periods.map((item, i) => (
              <Th key={i}>{item.period}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {measures.map(item => (
            <tr key={item.kpi.id}>
              <Td>{item.kpi.id}</Td>
              <Td>
                <Link href={`/scorecards/KPI/${item.kpi.id}`}>
                  {getTrans(lang, item.kpi.name)}
                </Link>
              </Td>
              <Td>
                {(ownerMap[item.kpi.id] || []).map((name, i) => (
                  <div key={i}>
                    <DisplayTransString value={name} />
                  </div>
                ))}
              </Td>
              <Td>
                {item.initiativeItems.map(initiative => (
                  <div key={initiative.id}>
                    <Link href={`/initiatives/${initiative.id}`}>
                      <DisplayTransString value={initiative.name} />
                    </Link>
                  </div>
                ))}
              </Td>
              <Td>
                <DisplayTransString
                  value={levelMap[item.kpi.kpiLevelId].name}
                />
              </Td>
              <Td>{frequencyMap[item.kpi.periodFrequency]}</Td>
              {periods.map((period, i) => {
                const perf = kpiPeriodMapping[`${item.kpi.id}_${period.key}`];
                if (!perf) {
                  return <Td key={i}></Td>;
                }
                if (period.type === 'target') {
                  return (
                    <Td key={i}>
                      {formatKpiValue(
                        perf.aggregatedTarget,
                        item.kpi.dataTypeId
                      )}
                    </Td>
                  );
                }
                if (period.type === 'value') {
                  return (
                    <Td key={i}>
                      {formatKpiValue(
                        perf.aggregatedValue,
                        item.kpi.dataTypeId
                      )}
                    </Td>
                  );
                } else {
                  const suffix = getKpiPerformanceSuffix(item.kpi);
                  const lookup = lookupMap[perf.performanceColorId];

                  return (
                    <Td key={i}>
                      {perf.performance != null &&
                        (period.color ? (
                          <PerformanceColor color={lookup.slug}>
                            {perf.performance} {suffix}
                          </PerformanceColor>
                        ) : (
                          <span>
                            {perf.performance} {suffix}
                          </span>
                        ))}
                    </Td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </Scroll>
  );
}
