import React from 'react';
import { DataTable, Column } from 'src/components/DataTable';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { getReportingCyclesState, ReportingCyclesActions } from '../interface';
import { ReportingCycle } from 'src/types-next';
import { useActions } from 'typeless';
import { formatDate } from 'src/common/utils';
import { ActionButtons } from 'src/components/ActionButtons';
import { Button } from 'src/components/Button';
import { useTranslation } from 'react-i18next';

export const ReportingCyclesView = () => {
  const {
    isLoading,
    sortBy,
    items,
    pageIndex,
    totalCount,
    sortType,
    pageSize,
    isInitiativeNewCycleLoading,
  } = getReportingCyclesState.useState();
  const { t } = useTranslation();
  const { search, initiativeNewCycle } = useActions(ReportingCyclesActions);

  const columns: Array<Column<ReportingCycle>> = [
    {
      name: 'id',
      displayName: 'ID',
      sortable: true,
      renderCell: item => item.id,
    },
    {
      name: 'state',
      displayName: 'Status',
      renderCell: item => item.status,
    },
    {
      name: 'startDate',
      displayName: 'Start Date',
      sortable: true,
      renderCell: item => formatDate(item.startDate),
    },
    {
      name: 'endDate',
      displayName: 'End Date',
      sortable: true,
      renderCell: item => formatDate(item.endDate),
    },
  ];

  return (
    <>
      <Page>
        <Portlet>
          <ActionButtons style={{ paddingTop: 20 }}>
            <Button
              loading={isInitiativeNewCycleLoading}
              onClick={initiativeNewCycle}
            >
              {t('Initiative New cycle')}
            </Button>
          </ActionButtons>
          <DataTable<ReportingCycle>
            sortBy={sortBy}
            sortDesc={sortType === 'DESC'}
            isLoading={isLoading}
            items={items}
            columns={columns}
            pageSize={pageSize}
            pageNumber={pageIndex - 1}
            total={totalCount}
            search={search}
          />
        </Portlet>
      </Page>
    </>
  );
};
