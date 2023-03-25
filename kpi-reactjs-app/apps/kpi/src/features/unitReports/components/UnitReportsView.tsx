import React from 'react';
import { DataTable, Column } from 'src/components/DataTable';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { getUnitReportsState, UnitReportsActions } from '../interface';
import { UnitReport } from 'src/types-next';
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';
import { Link } from 'src/components/Link';

export const UnitReportsView = () => {
  const {
    isLoading,
    sortBy,
    items,
    pageIndex,
    totalCount,
    sortType,
    pageSize,
  } = getUnitReportsState.useState();
  const { search } = useActions(UnitReportsActions);
  const { t } = useTranslation();

  const columns: Array<Column<UnitReport>> = [
    {
      name: 'id',
      displayName: 'ID',
      sortable: true,
      renderCell: item => item.id,
    },
    {
      name: 'type ',
      displayName: 'Type',
      sortable: false,
      renderCell: item => item.type,
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <Link
            href={
              item.type === 'KPISeries'
                ? `/kpi-report/${item.id}`
                : `/excellence-report/${item.id}`
            }
          >
            {t('View')}
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <Page>
        <Portlet>
          <DataTable<UnitReport>
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
