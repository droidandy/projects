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

export function ExcellenceTableColumns() {
  const { t } = useTranslation();
  const sticky = useSticky();

  return (
    <TableColumns sticky={sticky}>
      <Cell>{t('ID')}</Cell>
      <Cell>{t('Name')}</Cell>
      <Cell center>{t('Status')}</Cell>
      <Cell center>{t('Start Date')}</Cell>
      <Cell center>{t('End Date')}</Cell>
      <Cell center>{t('Evidences')}</Cell>
    </TableColumns>
  );
}
