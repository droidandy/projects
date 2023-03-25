import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { Organization } from 'src/types-next';
import { getOrganizationsState, OrganizationsActions } from '../interface';
import { useActions } from 'typeless';
import { OrganizationsFilter } from './OrganizationsFilter';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { ExportButton } from 'src/components/ExportButton';

export const OrganizationsView = () => {
  const {
    isLoading,
    sortType,
    sortBy,
    items,
    totalCount,
    pageIndex,
    pageSize,
  } = getOrganizationsState.useState();
  const { search, onExport, removeItem } = useActions(OrganizationsActions);
  const language = useLanguage();

  const columns: Array<Column<Organization>> = [
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
      renderCell: item => item.name[language],
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link href={`/settings/organizations/${item.id}`}>
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

  return (
    <>
      <Page>
        <Portlet>
          <OrganizationsFilter />
          <ActionButtons>
            <AddButton href="/settings/organizations/new">
              Add Organization
            </AddButton>
            <ExportButton onClick={onExport} />
          </ActionButtons>

          <DataTable<Organization>
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
