import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { getStrategicPlansState, StrategicPlansActions } from '../interface';
import { useActions } from 'typeless';
import { StrategicPlansFilter } from './StrategicPlansFilter';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { ExportButton } from 'src/components/ExportButton';
import { OnPermission } from 'src/components/OnPermission';
import { getGlobalState } from 'src/features/global/interface';
import { StrategicPlan } from 'src/types-next';

export const StrategicPlansView = () => {
  const {
    isLoading,
    sortType,
    sortBy,
    items,
    totalCount,
    pageIndex,
    pageSize,
  } = getStrategicPlansState.useState();
  const { permissionMap } = getGlobalState.useState();
  const { search, onExport, removeItem } = useActions(StrategicPlansActions);
  const language = useLanguage();

  const columns: Array<Column<StrategicPlan>> = [
    {
      name: 'id',
      displayName: 'ID',
      sortable: true,
      renderCell: item => item.id,
    },
    {
      name: 'name',
      displayName: 'Name',
      sortable: true,
      renderCell: item =>
        item.name[language] + ` ${item.startYear} - ${item.endYear}`,
    },
    {
      name: 'startYear',
      displayName: 'Start Date',
      sortable: true,
      renderCell: item => item.startYear,
    },
    {
      name: 'endYear',
      displayName: 'End Date',
      sortable: true,
      renderCell: item => item.endYear,
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link href={`/settings/strategic-plans/${item.id}`}>
              <Trans>View</Trans>
            </Link>{' '}
            <Link onClick={() => removeItem(item)}>
              <Trans>Delete</Trans>
            </Link>
          </div>
        );
      },
    },
  ];
  if (!permissionMap['strategic-plan:view']) {
    columns.pop();
  }
  return (
    <>
      <Page>
        <Portlet>
          <StrategicPlansFilter />
          <ActionButtons>
            <OnPermission permission="strategic-plan:add">
              <AddButton href="/settings/strategic-plans/new">
                Add Strategic Plan
              </AddButton>
            </OnPermission>
            <OnPermission permission="strategic-plans:export">
              <ExportButton onClick={onExport} />
            </OnPermission>
          </ActionButtons>

          <DataTable<StrategicPlan>
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
