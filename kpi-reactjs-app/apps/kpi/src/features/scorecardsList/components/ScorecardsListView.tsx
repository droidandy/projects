import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { BalancedScorecard } from 'src/types-next';
import { getScorecardsListState, ScorecardsListActions } from '../interface';
import { useActions } from 'typeless';
import { ScorecardsListFilter } from './ScorecardsListFilter';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { getTrans } from 'src/common/utils';

export const ScorecardsListView = () => {
  const {
    isLoading,
    sortBy,
    items,
    totalCount,
    pageSize,
    pageIndex,
    sortType,
  } = getScorecardsListState.useState();
  const { search, onDelete } = useActions(ScorecardsListActions);
  const lang = useLanguage();
  const { t } = useTranslation();

  const columns: Array<Column<BalancedScorecard>> = [
    {
      name: 'id',
      displayName: 'Id',
      sortable: true,
      renderCell: item => item.id,
    },
    {
      name: 'name',
      displayName: 'Name',
      sortable: true,
      renderCell: item => getTrans(lang, item.name),
    },
    {
      name: 'description',
      displayName: 'Description',
      sortable: false,
      renderCell: item => getTrans(lang, item.description),
    },
    {
      name: 'unitId',
      displayName: 'UnitID',
      sortable: true,
      renderCell: item => item.unitId,
    },
    {
      name: 'organizationId',
      displayName: 'OrganizationID',
      sortable: true,
      renderCell: item => item.organizationId,
    },
    {
      name: 'strategicPlanId',
      displayName: 'StrategicPlanID',
      sortable: true,
      renderCell: item => item.strategicPlanId,
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => (
        <div>
          <Link href={`/settings/scorecards/${item.id}`}>
            <Trans>{t('View')}</Trans>
          </Link>{' '}
          <Link onClick={() => onDelete(item)}>
            <Trans>Delete</Trans>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <Page>
        <Portlet>
          <ScorecardsListFilter />
          <ActionButtons>
            <AddButton href="/settings/scorecards/new">Add Scorecard</AddButton>
          </ActionButtons>
          <DataTable<BalancedScorecard>
            sortBy={sortBy}
            isLoading={isLoading}
            items={items}
            columns={columns}
            pageSize={pageSize}
            pageNumber={pageIndex - 1}
            total={totalCount}
            search={search}
            sortDesc={sortType === 'DESC'}
          />
        </Portlet>
      </Page>
    </>
  );
};
