import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { Metric } from 'src/types';
import { getMetricsState, MetricsActions } from '../interface';
import { useActions } from 'typeless';
import { MetricsFilter } from './MetricsFilter';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { ExportButton } from 'src/components/ExportButton';
import { OnPermission } from 'src/components/OnPermission';
import { getGlobalState } from 'src/features/global/interface';

export const MetricsView = () => {
  const {
    isLoading,
    sortDesc,
    sortBy,
    items,
    total,
    pageNumber,
    pageSize,
  } = getMetricsState.useState();
  const { permissionMap } = getGlobalState.useState();
  const { search, onExport } = useActions(MetricsActions);
  const language = useLanguage();

  const columns: Array<Column<Metric>> = [
    {
      name: 'id',
      displayName: 'Id',
      sortable: true,
      renderCell: item => item.id,
    },
    {
      name: 'name',
      displayName: 'Name',
      sortable: true,
      renderCell: item => item.name[language],
    },
    {
      name: 'enabled',
      displayName: 'Enabled',
      sortable: true,
      renderCell: item => (item.enabled ? 'Yes' : 'No'),
    },
    {
      name: 'metricType',
      displayName: 'Metric Type',
      sortable: true,
      renderCell: item => item.metricType,
    },
    {
      name: 'dataType',
      displayName: 'Data Type',
      sortable: true,
      renderCell: item => item.dataType,
    },
    {
      name: 'dataSource',
      displayName: 'Data Source',
      sortable: true,
      renderCell: item => item.dataSource,
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link href={`/settings/metrics/${item.id}`}>
              <Trans>View</Trans>
            </Link>
          </div>
        );
      },
    },
  ];
  if (!permissionMap['metric:view']) {
    columns.pop();
  }
  return (
    <>
      <Page>
        <Portlet>
          <MetricsFilter />
          <ActionButtons>
            <OnPermission permission="metric:add">
              <AddButton href="/settings/metrics/new">Add Metric</AddButton>
            </OnPermission>
            <OnPermission permission="metrics:export">
              <ExportButton onClick={onExport} />
            </OnPermission>
          </ActionButtons>

          <DataTable<Metric>
            sortBy={sortBy}
            sortDesc={sortDesc}
            isLoading={isLoading}
            items={items}
            columns={columns}
            pageSize={pageSize}
            pageNumber={pageNumber}
            total={total}
            search={search}
          />
        </Portlet>
      </Page>
    </>
  );
};
