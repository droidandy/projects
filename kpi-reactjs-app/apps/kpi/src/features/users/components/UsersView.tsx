import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { User } from 'src/types-next';
import { getUsersState, UsersActions } from '../interface';
import { useActions } from 'typeless';
import { UsersFilter } from './UsersFilter';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';

export const UsersView = () => {
  const {
    isLoading,
    sortBy,
    sortType,
    items,
    pageIndex,
    totalCount,
    pageSize,
  } = getUsersState.useState();
  const { search, onDelete } = useActions(UsersActions);
  const language = useLanguage();

  const columns: Array<Column<User>> = [
    {
      name: 'name',
      displayName: 'Name',
      sortable: true,
      renderCell: item => item.name[language],
    },
    {
      name: 'email',
      displayName: 'Email',
      sortable: true,
      renderCell: item => item.email,
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link href={`/settings/users/${item.id}`}>
              <Trans>View</Trans>
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
          <UsersFilter />
          <ActionButtons>
            <AddButton href="/settings/users/new">Add User</AddButton>
          </ActionButtons>

          <DataTable<User>
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
