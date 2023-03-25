import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { Challenge } from 'src/types-next';
import { getChallengesState, ChallengesActions } from '../interface';
import { useActions } from 'typeless';
import { useLanguage } from 'src/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { getTrans, formatCalendarPeriod } from 'src/common/utils';
import { Link } from 'typeless-router';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';

export const ChallengesView = () => {
  const {
    isLoading,
    sortBy,
    items,
    pageIndex,
    totalCount,
    sortType,
    pageSize,
  } = getChallengesState.useState();
  const { search, onDelete } = useActions(ChallengesActions);
  const lang = useLanguage();
  const { t } = useTranslation();

  const columns: Array<Column<Challenge>> = [
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
      name: 'period',
      displayName: 'Time',
      sortable: true,
      renderCell: item =>
        formatCalendarPeriod({
          id: 0,
          type: item.affectedPeriodFrequency,
          year: item.affectedPeriodYear,
          periodNumber: item.affectedPeriodNumer,
        }),
    },
    {
      name: 'itemName',
      displayName: 'Linked To',
      sortable: true,
      renderCell: item => getTrans(lang, item.balancedScorecardItem.name),
    },
    {
      name: 'affectedUnitName',
      displayName: 'Affected Unit',
      sortable: true,
      renderCell: item => getTrans(lang, item.affectedUnit.name),
    },
    {
      name: 'challengedUnitName',
      displayName: 'Challenged Unit',
      sortable: true,
      renderCell: item => getTrans(lang, item.challengedUnit.name),
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link href={`/challenges/${item.id}`}>{t('View')}</Link>
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
          <ActionButtons style={{ paddingTop: 20 }}>
            <AddButton href="/challenges/new">Add Challenge</AddButton>
          </ActionButtons>

          <DataTable<Challenge>
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
