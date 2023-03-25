import React from 'react';
import * as DateFns from 'date-fns';
import { DataTable, Column } from 'src/components/DataTable';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { getMyTasksState, MyTasksActions } from '../interface';
import { Task } from 'src/types-next';
import { useActions } from 'typeless';
import { useLanguage } from 'src/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { Link } from 'src/components/Link';
import { formatDate } from 'src/common/utils';

export const MyTasksView = () => {
  const {
    isLoading,
    sortBy,
    items,
    pageIndex,
    totalCount,
    sortType,
    pageSize,
  } = getMyTasksState.useState();
  const { search } = useActions(MyTasksActions);
  const language = useLanguage();
  const { t } = useTranslation();

  const columns: Array<Column<Task>> = [
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
      renderCell: item =>
        item.challengeId ? (
          <Link href={`/challenges/${item.challengeId}`}>
            {item.name[language]}
          </Link>
        ) : (
          item.name[language]
        ),
    },
    {
      name: 'phase',
      displayName: 'Phase',
      renderCell: item => '-',
    },
    {
      name: 'state',
      displayName: 'Status',
      renderCell: item => {
        const date = new Date(item.scheduledEndDate);
        const now = new Date();
        if (now.getDate() > date.getDate()) {
          const text = DateFns.formatDistanceStrict(now, date);
          return text + ' ' + t('left');
        } else {
          const text = DateFns.formatDistanceStrict(date, now);
          return text + ' ' + t('late');
        }
      },
    },
    {
      name: 'scheduledEndDate',
      displayName: 'Due Date',
      sortable: true,
      renderCell: item => formatDate(item.scheduledEndDate),
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        if (item.kpiDataSeriesId) {
          return (
            <Link href={`/my-tasks/${item.id}/submit`}>{t('Submit')}</Link>
          );
        } else if (
          item.taskType === 'ChallengeResponse' ||
          item.taskType === 'ChallengeResponseReview'
        ) {
          return (
            <Link href={`/my-tasks/${item.challengeId}/${item.taskType}`}>
              {t('View')}
            </Link>
          );
        } else {
          return <Link href={`/my-tasks/${item.id}`}>{t('View')}</Link>;
        }
      },
    },
  ];

  return (
    <>
      <Page>
        <Portlet>
          <DataTable<Task>
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
