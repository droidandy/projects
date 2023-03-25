import React from 'react';
import { DataTable, Column } from 'src/components/DataTable';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { getExcellenceState, ExcellenceActions } from '../interface';
import { ExcellenceRequirement } from 'src/types-next';
import { useActions } from 'typeless';
import { useLanguage } from 'src/hooks/useLanguage';
import { Link } from 'src/components/Link';
import { useTranslation } from 'react-i18next';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';
import { AddButton } from 'src/components/AddButton';
import { ActionButtons } from 'src/components/ActionButtons';
import { ExcellenceModal, ExcellenceDetailsActions } from './ExcellenceModal';
import { formatDate } from 'src/common/utils';
import { Badge } from 'src/components/Badge';
import { ExcellenceFilterDropDown } from 'src/components/ExcellenceFilterDropDown';

export const ExcellenceView = () => {
  const {
    isLoading,
    sortBy,
    items,
    pageIndex,
    totalCount,
    sortType,
    pageSize,
  } = getExcellenceState.useState();
  const { search, onDelete } = useActions(ExcellenceActions);
  const { show: showDetails } = useActions(ExcellenceDetailsActions);
  const language = useLanguage();
  const { t } = useTranslation();

  const formatBool = (bool: boolean) => (bool ? t('Yes') : t('No'));

  const columns: Array<Column<ExcellenceRequirement>> = [
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
      name: 'status',
      displayName: 'Status',
      renderCell: item => (
        <Badge
          type={
            item.isCompleted ? 'success' : item.isEnabled ? 'warning' : 'error'
          }
        >
          &nbsp; &nbsp; &nbsp; &nbsp;
        </Badge>
      ),
    },
    {
      name: 'theme',
      displayName: 'Theme',
      renderCell: item =>
        item.excellenceTheme ? item.excellenceTheme.name[language] : '-',
    },
    {
      name: 'criteria',
      displayName: 'Criteria',
      renderCell: item =>
        item.excellenceCriteria.parentCriteria ? item.excellenceCriteria.parentCriteria.name[language] : '-',
    },
    {
      name: 'responsibleUnitName',
      displayName: 'Responsible Unit Name',
      renderCell: item =>
        item.responsibleUnit ? item.responsibleUnit.name[language] : '-',
    },
    {
      name: 'subCriteria',
      displayName: 'Sub Criteria',
      renderCell: item =>
        item.excellenceCriteria ? item.excellenceCriteria.name[language] : '-',
    },
    {
      name: 'requirementStatus',
      displayName: 'Exist?',
      renderCell: item => formatBool(item.requirementStatus === 'Exist'),
    },
    {
      name: 'isActive',
      displayName: 'Active?',
      renderCell: item => formatBool(item.isEnabled),
    },
    {
      name: 'isCompleted',
      displayName: 'Completed?',
      renderCell: item => formatBool(item.isCompleted),
    },
    {
      name: 'startDate',
      displayName: 'Start Date',
      renderCell: item => formatDate(item.startDate),
    },
    {
      name: 'endDate',
      displayName: 'End Date',
      renderCell: item => formatDate(item.endDate),
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link onClick={() => showDetails('view', item)}>{t('View')}</Link>
            {' | '}
            <Link onClick={() => showDetails('edit', item)}>{t('Edit')}</Link>
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
      <ExcellenceModal />
      <Page>
        <Portlet>
          <ActionButtons style={{ paddingTop: 20, display: 'flex' }}>
            <AddButton onClick={() => showDetails('add')}>
              Add Excellence
            </AddButton>
            <ExcellenceFilterDropDown />
          </ActionButtons>
          <DataTable<ExcellenceRequirement>
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
