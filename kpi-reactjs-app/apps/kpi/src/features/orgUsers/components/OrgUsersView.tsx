import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { OrgUser } from 'src/types-next';
import { getOrgUsersState, OrgUsersActions } from '../interface';
import { useActions } from 'typeless';
// import { OrgUsersFilter } from './OrgUsersFilter';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';
import { OrgUsersDropDown } from '../../../components/OrgUsersDropDown';

export const OrgUsersView = () => {
  const {
    isLoading,
    sortBy,
    sortType,
    items,
    pageIndex,
    totalCount,
    pageSize,
  } = getOrgUsersState.useState();
  const { search, onDelete } = useActions(OrgUsersActions);
  const language = useLanguage();

  const columns: Array<Column<OrgUser>> = [
    {
      name: 'name',
      displayName: 'Name',
      renderCell: item => item.user.name && item.user.name[language],
    },
    {
      name: 'email',
      displayName: 'Email',
      renderCell: item => item.user.email,
    },
    {
      name: 'roles',
      displayName: 'Roles',
      renderCell: item =>
        item.orgUserRoles.map((el, index) => {
          return item.orgUserRoles.length - 1 !== index
            ? el.role.name[language] + ', '
            : el.role.name[language];
        }),
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link href={`/settings/org-users/${item.id}`}>
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
          {/* <OrgUsersFilter /> */}
          <ActionButtons style={{ paddingTop: 20, display: 'flex' }}>
            <AddButton href="/settings/org-users/new">Add Org User</AddButton>
            <OrgUsersDropDown />
          </ActionButtons>

          <DataTable<OrgUser>
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
