import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import {
  getExcellenceCriteriasState,
  ExcellenceCriteriasActions,
} from '../interface';
import { useActions } from 'typeless';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { ExcellenceCriteria } from 'src/types-next';
import { formatDate } from '../../../common/utils';
import { ExcellenceCriteriasFilter } from './ExcellenceCriteriasFilter';
import { ConfirmDeleteLink } from '../../../components/ConfirmDeleteLink';

export const ExcellenceCriteriasView = () => {
  const {
    isLoading,
    sortType,
    sortBy,
    items,
    totalCount,
    pageIndex,
    pageSize,
  } = getExcellenceCriteriasState.useState();
  const { search, removeItem } = useActions(ExcellenceCriteriasActions);
  const language = useLanguage();

  const columns: Array<Column<ExcellenceCriteria>> = [
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
      name: 'parentId',
      displayName: 'Parent Name',
      sortable: true,
      renderCell: item =>
        item.parentCriteria ? item.parentCriteria.name[language] : '-',
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
            <Link href={`/settings/excellence-criterias/${item.id}`}>
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
        <ExcellenceCriteriasFilter />
        <Portlet>
          <ActionButtons style={{ paddingTop: 20 }}>
            <AddButton href="/settings/excellence-criterias/new">
              Add Excellence Criteria
            </AddButton>
          </ActionButtons>

          <DataTable<ExcellenceCriteria>
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
