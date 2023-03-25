import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TableRow } from './TableRow';
import { useSticky } from 'src/hooks/useSticky';

const Cell = styled.div<{ center?: boolean }>`
  font-weight: bold;
  ${props => props.center && 'text-align: center'};
`;
const TableColumns = styled(TableRow)`
  background-color: #F7F9FC;
  height: 50px;
`;

export function MyKpiTableColumns() {
  const { t } = useTranslation();
  const sticky = useSticky();

  return (
    <TableColumns sticky={sticky}>
      <Cell>{t('Title')}</Cell>
      <Cell center>{t('Frequency')}</Cell>
      <Cell center>{t('Level')}</Cell>
      <Cell center>{t('Scoring Type')}</Cell>
      <Cell center>{t('Aggregation Type')}</Cell>
      <Cell center>{t('Status')}</Cell>
      <Cell center>{t('Actions')}</Cell>
    </TableColumns>
  );
}
