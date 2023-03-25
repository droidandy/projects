import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { Role } from 'src/types-next';
import { getRolesState, RolesActions } from '../interface';
import { useActions } from 'typeless';
import { RolesFilter } from './RolesFilter';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';

export const RolesView = () => {
  const {
    isLoading,
    sortBy,
    sortType,
    items,
    pageIndex,
    totalCount,
    pageSize,
  } = getRolesState.useState();
  const { search, onDelete } = useActions(RolesActions);
  const language = useLanguage();

  const columns: Array<Column<Role>> = [
    {
      name: 'name',
      displayName: 'Name',
      sortable: true,
      renderCell: item => item.name[language],
    },
    {
      name: 'roles',
      displayName: 'Roles',
      renderCell: item => (
        <>
          {item.rolePermissions.map(perm => (
            <div key={perm.id}>{perm.permission.name}</div>
          ))}
        </>
      ),
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link href={`/settings/roles/${item.id}`}>
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
          <RolesFilter />
          <ActionButtons>
            <AddButton href="/settings/roles/new">Add Role</AddButton>
          </ActionButtons>

          <DataTable<Role>
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
