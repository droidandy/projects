import * as React from 'react';
import styled, { css } from 'styled-components';
import { TableRow } from './TableRow';
import { KpiMeasure, Lookup, KPILevel } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { useTranslation } from 'react-i18next';
import { Colors } from 'src/Const';
import { KpiActions } from 'src/components/KpiActions';

interface MyKpiRowProps {
  className?: string;
  item: KpiMeasure;
  lookupMap: Record<string, Lookup>;
  levelMap: Record<string, KPILevel>;
}

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Sub = styled.div`
  font-size: 12px;
`;

interface StatusProps {
  color: 'gray' | 'green' | 'yellow';
}

const Status = styled.div<StatusProps>`
  background: #10a6e9;
  border-radius: 3px;
  width: 80px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  ${props => {
    switch (props.color) {
      case 'gray':
        return css`
          background: ${Colors.gray};
        `;
      case 'green':
        return css`
          background: ${Colors.green};
        `;
      case 'yellow':
        return css`
          background: ${Colors.yellow};
          color: black;
        `;
    }
  }}
`;

const _MyKpiRow = (props: MyKpiRowProps) => {
  const { className, item, lookupMap, levelMap } = props;
  const { t } = useTranslation();
  return (
    <TableRow className={className}>
      {/* Title */}
      <div>
        <strong>
          <DisplayTransString value={item.kpi.name} />
        </strong>
        <Sub>
          {item.kpi.id} {item.kpi.kpiCode}
        </Sub>
      </div>

      {/* Frequency */}
      <Center>{t(item.kpi.periodFrequency)}</Center>

      {/* Level */}
      <Center>
        <DisplayTransString value={levelMap[item.kpi.kpiLevelId]?.name} />
      </Center>

      {/* Scoring Type */}
      <Center>
        <DisplayTransString value={lookupMap[item.kpi.scoringTypeId]} />
      </Center>

      {/* Aggregation Type */}
      <Center>{t(item.kpi.aggregationType)}</Center>

      {/* Status */}
      <Center>
        <Status
          color={
            item.kpi.status === 'Scheduled'
              ? 'gray'
              : item.kpi.status === 'Active'
              ? 'green'
              : 'yellow'
          }
        >
          {t(item.kpi.status)}
        </Status>
      </Center>

      {/* Actions */}
      <KpiActions kpi={item.kpi} />
    </TableRow>
  );
};

export const MyKpiRow = styled(_MyKpiRow)`
  border-bottom: 1px solid #f2f3f8;
`;
