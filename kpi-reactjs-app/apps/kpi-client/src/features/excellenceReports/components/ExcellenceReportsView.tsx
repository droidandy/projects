import React, { useState } from 'react';
import {
  getExcellenceReportsState,
  ExcellenceReportsActions,
} from '../interface';
import styled from 'styled-components';
import { ExcellenceReportsFilters } from './ExcellenceReportsFilters';
import { useActions } from 'typeless';
import { TableView } from 'src/components/TableView';
import { useTranslation } from 'react-i18next';
import { BaseTableRow } from 'src/components/BaseTableRow';
import { useSticky } from 'src/hooks/useSticky';
import { _getCriteria } from '../module';
import { useLanguage } from 'src/hooks/useLanguage';

export function TableColumns() {
  const { t } = useTranslation();
  const [sort, setSort] = useState(0);
  const { sortType } = getExcellenceReportsState.useState();
  const { changeSortType } = useActions(ExcellenceReportsActions);
  const sticky = useSticky();
  const titleArray = [
    { name: '#', sortBy: 'kpi.id' },
    { name: 'Name' },
    { name: 'Status' },
    { name: 'Theme' },
    { name: 'Criteria' },
    { name: 'Responsible Unit Name' },
    { name: 'Sub Criteria' },
    { name: 'Exist' },
    { name: 'Active' },
    { name: 'Completed' },
    { name: 'Start Date' },
    { name: 'End Date' },
  ];

  return (
    <TableRow sticky={sticky}>
      {titleArray.map((title, idx) => {
        if (sort === idx) {
          return (
            <div
              style={{ cursor: 'pointer', color: '#1baaf1' }}
              key={idx}
              onClick={() =>
                sortType === 'ASC'
                  ? changeSortType('DESC')
                  : changeSortType('ASC')
              }
            >
              {t(title.name)}
            </div>
          );
        } else {
          return (
            <div
              style={{ cursor: 'pointer' }}
              key={idx}
              onClick={() => {
                changeSortType('ASC', title.sortBy || 'performance.id'),
                  setSort(idx);
              }}
            >
              {t(title.name)}
            </div>
          );
        }
      })}
    </TableRow>
  );
}

const getColor = (item: any) => {
  const { isCompleted, isEnabled } = item;
  if (isCompleted && isEnabled) {
    return '#8EC684';
  } else if (!isCompleted && isEnabled) {
    return '#FEAD33';
  } else {
    return '#FF3766';
  }
};

const getStatus = (item: any) => {
  const { isCompleted, isEnabled } = item;
  if (isCompleted && isEnabled) {
    return 'Completed';
  } else if (!isCompleted && isEnabled) {
    return 'Active';
  } else {
    return item.requirementStatus === 'Exist' ? 'Exist' : 'Not Exist';
  }
};

export const ExcellenceReportsView = () => {
  const { t } = useTranslation();
  const lang = useLanguage();
  const { items, isLoading } = getExcellenceReportsState.useState();
  const title = t('Excellence Reports');

  return (
    <>
      <TableView
        flex
        title={title}
        header={
          <>
            <ExcellenceReportsFilters />
            <TableColumns />
          </>
        }
        isLoading={isLoading}
      >
        {items.map(item => {
          return (
            <TableContentRow key={item.id}>
              <div>{item.id}</div>
              <div>
                <strong>{item.name[lang] ? item.name[lang] : '-'}</strong>
              </div>
              <div>
                <Status
                  style={{
                    background: getColor(item),
                  }}
                >
                  {t(getStatus(item))}
                </Status>
              </div>
              <div>
                {item.excellenceTheme.name
                  ? item.excellenceTheme.name[lang]
                  : '-'}
              </div>

              <div>
                {item.excellenceCriteria!.parentCriteria!.name
                  ? item.excellenceCriteria!.parentCriteria!.name[lang]
                  : '-'}
              </div>

              <div>
                {item.responsibleUnit.name
                  ? item.responsibleUnit.name[lang]
                  : '-'}
              </div>
              <div>
                {item.excellenceCriteria.name
                  ? item.excellenceCriteria.name[lang]
                  : '-'}
              </div>
              <div>{item.requirementStatus! === 'Exist' ? 'Yes' : 'No'}</div>
              <div>{item.isEnabled! ? 'Yes' : 'No'}</div>
              <div>{item.isCompleted ? 'Yes' : 'No'}</div>
              <div>{item.startDate ? item.startDate.slice(0, 10) : '-'}</div>
              <div>{item.endDate ? item.endDate.slice(0, 10) : '-'}</div>
            </TableContentRow>
          );
        })}
      </TableView>
    </>
  );
};

const Status = styled.div`
  border-radius: 3px;
  width: 100%;
  width: 90px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const TableRow = styled(BaseTableRow)`
  background: #e6f0f3;
  border-radius: 3px;
  padding: 10px 20px;

  & > div {
    flex-shrink: 0;
    width: 90px;
    text-align: center;
    font-weight: 700;
  }

  & > :nth-child(1) {
    width: 40px;
  }
  & > :nth-child(2) {
    flex: 1 0 0;
    text-align: right;
  }
  & > :nth-child(3) {
    width: 120px;
  }
  & > :nth-child(4) {
    width: 120px;
  }
  & > :nth-child(5) {
    width: 120px;
  }
  & > :nth-child(6) {
    width: 120px;
  }
  & > :nth-child(7) {
    width: 140px;
  }
`;

export const TableContentRow = styled(BaseTableRow)`
  border-bottom: 2px solid #f9f9fc;
  padding: 5px 20px;
  background: #fff;
  min-height: 60px;

  & > div {
    flex-shrink: 0;
    width: 90px;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  & > span {
    flex-shrink: 0;
    width: 70px;
    height: 30px;
    border-radius: 20px;
    margin: 0 10px;
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: center;
  }

  & > span > span {
    width: 5px;
    ${props =>
      props.color
        ? `background: ${props.color.slice(5)}`
        : `background:  #e6f0f3`};
    height: 5px;
    border-radius: 2px;
  }

  & > span > div {
    width: 50px;
    text-align: right;
    padding: 3px;
  }

  & > :nth-child(1) {
    width: 40px;
  }
  & > :nth-child(2) {
    flex: 1 0 0;
    justify-content: right;
    color: #232222;
  }
  & > :nth-child(3) {
    text-align: center;
    width: 120px;
  }
  & > :nth-child(4) {
    width: 120px;
  }
  & > :nth-child(5) {
    width: 120px;
  }
  & > :nth-child(6) {
    width: 120px;
    text-align: center;
  }
  & > :nth-child(7) {
    width: 140px;
    text-align: center;
  }

  &:hover {
    background: #e6f0f3;
    transition: 0.5s;
    & > span {
      transition: 0.5s;
      ${props =>
        props.color
          ? `background: ${props.color.slice(5)}`
          : `background:  #e6f0f3`};
      opacity: 1;
      color: #fff;
    }
  }
`;
