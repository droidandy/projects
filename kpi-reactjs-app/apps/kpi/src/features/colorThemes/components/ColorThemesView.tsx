import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { getColorThemesState, ColorThemesActions } from '../interface';
import { useActions } from 'typeless';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { ColorTheme } from 'src/types-next';

export const ColorThemesView = () => {
  const {
    isLoading,
    sortType,
    sortBy,
    items,
    totalCount,
    pageIndex,
    pageSize,
  } = getColorThemesState.useState();
  const { search, removeItem } = useActions(ColorThemesActions);
  const language = useLanguage();

  const columns: Array<Column<ColorTheme>> = [
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
            <Link href={`/settings/color-themes/${item.id}`}>
              <Trans>View</Trans>
            </Link>
            {' | '}
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
          <ActionButtons style={{ paddingTop: 20 }}>
            <AddButton href="/settings/color-themes/new">
              Add Color Theme
            </AddButton>
          </ActionButtons>

          <DataTable<ColorTheme>
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
