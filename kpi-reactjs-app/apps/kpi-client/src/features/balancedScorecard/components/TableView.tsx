import * as React from 'react';
import styled from 'styled-components';
import * as R from 'remeda';
import { getBalancedScorecardState } from '../interface';
import { getGlobalState } from 'src/features/global/interface';
import {
  BalancedScorecardItemType,
  BalancedScorecardItem,
  Kpi,
} from 'shared/types';
import { useTranslation } from 'react-i18next';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { PerformanceBar } from 'src/components/PerformanceBar';
import { roundTo2 } from 'src/common/utils';
import { usePerformanceMap } from '../hooks';

interface TableViewProps {
  className?: string;
}

const Scroll = styled.div`
  overflow: auto;
`;

const _TableView = (props: TableViewProps) => {
  const { className } = props;
  const { scorecard } = getBalancedScorecardState.useState();
  const { lookups } = getGlobalState.useState();
  const { t } = useTranslation();
  const performanceMap = usePerformanceMap(lookups, scorecard);

  const itemTypes = React.useMemo(
    () =>
      lookups.filter(
        x =>
          x.category === 'BalancedScorecardItemType' &&
          x.id !== BalancedScorecardItemType.KPI
      ),
    [lookups]
  );

  const kpis = React.useMemo(
    () =>
      R.filter(
        scorecard.scorecardItems,
        x => x.typeId === BalancedScorecardItemType.KPI
      ),
    [scorecard]
  );

  const idMap = React.useMemo(
    () => R.indexBy(scorecard.scorecardItems, x => x.id),
    [scorecard]
  );

  const items = React.useMemo(() => {
    const travel = (
      item: BalancedScorecardItem,
      map: Record<string, BalancedScorecardItem>
    ) => {
      const parent = item.parentId && idMap[item.parentId];
      if (parent) {
        map[parent.typeId] = parent;
        travel(parent, map);
      }
    };
    return kpis.map((kpi: Kpi) => {
      const map: Record<string, BalancedScorecardItem> = {};
      travel(kpi, map);
      return {
        kpi,
        map,
      };
    });
  }, [kpis, idMap]);

  return (
    <div className={className}>
      <Scroll>
        <table>
          <thead>
            <tr>
              {itemTypes.map(type => (
                <th key={type.id}>
                  <DisplayTransString value={type} />
                </th>
              ))}
              <th>{t('Progress')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const { kpi, map } = item;
              const performance = performanceMap[kpi.id];
              return (
                <tr key={i}>
                  {itemTypes.map(type => (
                    <td key={type.id}>
                      {map[type.id] ? (
                        <DisplayTransString value={map[type.id].name} />
                      ) : (
                        t('No Parent')
                      )}
                    </td>
                  ))}
                  <td>
                    {performance ? (
                      <PerformanceBar color={performance.performanceColor.slug}>
                        {roundTo2(performance.performance)}%
                      </PerformanceBar>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Scroll>
    </div>
  );
};

export const TableView = styled(_TableView)`
  display: block;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
  border-radius: 0px 0px 3px 3px;
  margin-top: 5px;
  background: white;
  ${PerformanceBar} {
    width: 100%;
  }
  table {
    width: 100%;
    position: relative;
    border-spacing: 0;
  }
  thead {
    background: #edf2fa;
  }
  th {
    background: #edf2fa;
    top: 0;
    border: none;
    text-align: right;
  }
  th:last-child {
    position: sticky;
    left: 0;
    z-index: 1;
    text-align: center;
  }
  th,
  td {
    color: #244159;
    padding: 15px 30px;
    min-width: 250px;
  }
  td {
    border-top: 1px solid #f2f3f8;
  }
  td:last-child {
    position: sticky;
    left: 0;
    background: white;
  }
`;
