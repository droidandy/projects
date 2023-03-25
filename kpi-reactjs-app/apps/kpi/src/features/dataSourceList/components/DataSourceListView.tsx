import React from 'react';
import * as R from 'remeda';
import { DataTable, Column } from 'src/components/DataTable';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { getDataSourceListState, DataSourceListActions } from '../interface';
import { Resource } from 'src/types-next';
import { useActions } from 'typeless';
import { useLanguage } from 'src/hooks/useLanguage';
import { Link } from 'src/components/Link';
import { useTranslation } from 'react-i18next';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';
import { AddButton } from 'src/components/AddButton';
import { ActionButtons } from 'src/components/ActionButtons';
import { getRouterState } from 'typeless-router';
import { DataSourceFilter } from './DataSourceFilter';

export const DataSourceListView = () => {
  const {
    isLoading,
    sortBy,
    items,
    pageIndex,
    totalCount,
    sortType,
    pageSize,
  } = getDataSourceListState.useState();
  const { search, onDelete } = useActions(DataSourceListActions);
  const language = useLanguage();
  const { t } = useTranslation();
  const { pathname } = getRouterState.useState().location!;
  const typeName = R.last(pathname.split('/'));

  const columns: Array<Column<Resource>> = [
    {
      name: 'name',
      displayName: 'Name',
      sortable: true,
      renderCell: item => item.name[language],
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link href={`/scorecards/${typeName}/${item.id}?full=true`}>
              {t('View')}
            </Link>
            {' | '}
            <Link href={`/settings/strategy-items/${typeName}/${item.id}`}>
              {t('Edit')}
            </Link>
            {' | '}
            <ConfirmDeleteLink
              onYes={() => {
                onDelete(item);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Page>
        <Portlet>
          <DataSourceFilter />
          <ActionButtons style={{ paddingTop: 20 }}>
            <AddButton href={`/settings/strategy-items/${typeName}/new`}>
              Add
            </AddButton>
          </ActionButtons>
          <DataTable<Resource>
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
