import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import {
  getExcellenceThemesState,
  ExcellenceThemesActions,
} from '../interface';
import { useActions } from 'typeless';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { ExcellenceTheme } from 'src/types-next';
import { ExcellenceThemesFilter } from './ExcellenceThemesFilter';
import { ConfirmDeleteLink } from '../../../components/ConfirmDeleteLink';

export const ExcellenceThemesView = () => {
  const {
    isLoading,
    sortType,
    sortBy,
    items,
    totalCount,
    pageIndex,
    pageSize,
  } = getExcellenceThemesState.useState();
  const { search, removeItem } = useActions(ExcellenceThemesActions);
  const language = useLanguage();

  const columns: Array<Column<ExcellenceTheme>> = [
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
            <Link href={`/settings/excellence-themes/${item.id}`}>
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
          <ExcellenceThemesFilter />
          <ActionButtons style={{ paddingTop: 20 }}>
            <AddButton href="/settings/excellence-themes/new">
              Add Excellence Theme
            </AddButton>
          </ActionButtons>

          <DataTable<ExcellenceTheme>
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
