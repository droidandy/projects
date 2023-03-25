import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import {
  getLookupManagementState,
  LookupManagementActions,
} from '../interface';
import { useActions } from 'typeless';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { Lookup } from 'src/types-next';
import { ConfirmDeleteLink } from '../../../components/ConfirmDeleteLink';
import { LookupManagementFilter } from './LookupManagementFilter';

export const LookupManagementView = () => {
  const {
    isLoading,
    sortType,
    sortBy,
    items,
    totalCount,
    pageIndex,
    pageSize,
  } = getLookupManagementState.useState();
  const { search, removeItem } = useActions(LookupManagementActions);

  const columns: Array<Column<Lookup>> = [
    {
      name: 'id',
      displayName: 'ID',
      sortable: true,
      renderCell: item => item.id,
    },
    {
      name: 'en',
      displayName: 'En',
      sortable: true,
      renderCell: item => item.en,
    },
    {
      name: 'ar',
      displayName: 'Ar',
      sortable: true,
      renderCell: item => item.ar,
    },
    {
      name: 'category',
      displayName: 'Category',
      sortable: true,
      renderCell: item => (item.category ? item.category : '-'),
    },
    {
      name: 'slug',
      displayName: 'Slug',
      sortable: true,
      renderCell: item => (item.slug ? item.slug : '-'),
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link href={`/settings/lookup-management/${item.id}`}>
              <Trans>View</Trans>
            </Link>
            {' | '}
            <ConfirmDeleteLink
              onYes={() => {
                removeItem(item);
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
          <LookupManagementFilter />
          <ActionButtons>
            <AddButton href="/settings/lookup-management/new">
              Add Lookup
            </AddButton>
          </ActionButtons>
          <DataTable<Lookup>
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
