import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TableRow } from './TableRow';
import { useSticky } from 'src/hooks/useSticky';

const Cell = styled.div<{ center?: boolean }>`
  font-weight: bold;
  ${props => props.center && 'text-align: center'};
`;

export interface KpiTableColumnsProps {
  showStatus?: boolean;
}
const TableColumns = styled(TableRow)`
  background-color: #F7F9FC;
  height: 50px;
`;
export function KpiTableColumns(props: KpiTableColumnsProps) {
  const { showStatus } = props;
  const { t } = useTranslation();
  const sticky = useSticky();

  return (
    <TableColumns sticky={sticky}>
      <Cell>{t('KPI Name')}</Cell>
      <Cell center>{t('Type')}</Cell>
      <Cell center>{t('Frequency')}</Cell>
      <Cell center>{t('Target')}</Cell>
      <Cell center>{t('Actual')}</Cell>
      <Cell center>{t('Performance')}</Cell>
      <Cell center>{t('Yearly Progress')}</Cell>
      {showStatus && <Cell center>{t('Status')}</Cell>}
      <Cell center>{t('Evidences')}</Cell>
    </TableColumns>
  );
}
