import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { getSiteSettingsState, SiteSettingsActions } from '../interface';
import { useActions } from 'typeless';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { Setting } from 'src/types-next';
import { formatDate } from '../../../common/utils';
import { ConfirmDeleteLink } from '../../../components/ConfirmDeleteLink';
import { RecalculateButton } from 'src/components/RecalculateButton';

export const SiteSettingsPageView = () => {
  const {
    isLoading,
    sortType,
    sortBy,
    items,
    totalCount,
    pageIndex,
    pageSize,
  } = getSiteSettingsState.useState();
  const { search, removeItem } = useActions(SiteSettingsActions);
  const language = useLanguage();
  const columns: Array<Column<Setting>> = [
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
      renderCell: item => (item.name ? item.name[language] : '-'),
    },
    {
      name: 'key',
      displayName: 'Key',
      sortable: true,
      renderCell: item => (item.key ? item.key : '-'),
    },
    {
      name: 'value',
      displayName: 'Value',
      sortable: true,
      renderCell: item => (item.value ? item.value : '-'),
    },
    {
      name: 'type',
      displayName: 'Type',
      sortable: true,
      renderCell: item => (item.type ? item.type : '-'),
    },
    {
      name: 'createdDate',
      displayName: 'Create Date',
      sortable: true,
      renderCell: item =>
        item.createdDate ? formatDate(item.createdDate) : '-',
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link href={`/settings/site-settings/${item.id}`}>
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
          <ActionButtons style={{ paddingTop: 20 }}>
            <AddButton href="/settings/site-settings/new">
              Add Setting
            </AddButton>
            <RecalculateButton />
          </ActionButtons>
          <DataTable<Setting>
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
