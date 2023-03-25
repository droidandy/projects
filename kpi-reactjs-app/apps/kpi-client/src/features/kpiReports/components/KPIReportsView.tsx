import React, { useState } from 'react';
import { getKPIReportsState, KPIReportsActions } from '../interface';
import styled from 'styled-components';
import { KPIReportsFilters } from './KPIReportsFilters';
import { useActions } from 'typeless';
import { TableView } from 'src/components/TableView';
import { useTranslation } from 'react-i18next';
import { BaseTableRow } from 'src/components/BaseTableRow';
import { useSticky } from 'src/hooks/useSticky';
import { _getCriteria } from '../module';
import { PerformanceBar } from 'src/components/PerformanceBar';
import { FilterToggle } from 'src/components/FilterToggle';
// import { Pagination } from 'src/components/Pagination';
// import { PaginationDropdown } from 'src/components/PaginationDropdown';
export function roundTo2(n: number) {
  const ret:number = Math.round( Math.round(n * 100000000) / 1000000) / 100;
  return ret > 0.01 ? ret : 0;
}
export function TableColumns() {
  const { t } = useTranslation();
  const [sort, setSort] = useState(0);
  const { sortType } = getKPIReportsState.useState();
  const { changeSortType } = useActions(KPIReportsActions);
  const sticky = useSticky();
  const titleArray = [
    { name: 'ID', sortBy: 'kpi.id' },
    { name: 'KPI Name' },
    { name: 'Focal Point' },
    { name: 'KPI Level' },
    { name: 'KPI Type' },
    { name: 'KPI Measurement frequency' },
    { name: 'KPI Baseline' },
    { name: 'KPI Value' },
    { name: 'KPI Target' },
    { name: 'KPI Performance' },
    { name: 'Yearly Progress' }, 
  ];

  return (
    <TableRow sticky={sticky}>
      {titleArray.map((title, idx) => {
        if (sort === idx) {
          return (
            <div
              style={{ cursor: 'pointer', color: '#10A6E9' }}
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

export const KPIReportsView = () => {
  const { t } = useTranslation();
  const { items, isLoading, isFilterExpanded } = getKPIReportsState.useState();
  const { setIsFilterExpanded } = useActions(KPIReportsActions);
  const title = t('KPI Reports');

  return (
    <>
      <TableView
        flex
        title={title}
        titleAppend={
          <FilterToggle
            isFilterExpanded={isFilterExpanded}
            setIsFilterExpanded={setIsFilterExpanded}
          />
        }
        header={
          <>
            <KPIReportsFilters />
            <TableColumns />
          </>
        }
        isLoading={isLoading}
      >
        {items.map((item, index) => {
          return (
            <TableContentRow key={index} color={item.performanceColor}>
              <div>{item.id}</div>
              <div>
                <strong>{item.kpiName ? item.kpiName : '-'}</strong>
              </div>
              <div>{item.unitName ? item.unitName : '-'}</div>
              <div>{item.kpiLevel ? item.kpiLevel : '-'}</div>
              <div>{item.scoringType ? item.scoringType : '-'}</div>
              <div>{item.periodFrequency ? item.periodFrequency : '-'}</div>
              <div>
                {item.performanceScore ? item.performanceScore + '%' : '-'}
              </div>
              <div>
                {item.aggregatedValue ? item.aggregatedValue + '%' : '-'}
              </div>
              <div>
                {item.aggregatedTarget ? item.aggregatedTarget + '%' : '-'}
              </div>
              <div>
                <PerformanceBar color={item.performanceColor.slice(5).toLowerCase()}>
                  {item.performance ? roundTo2(item.performance) + '%' : '-'}
                </PerformanceBar>
              </div>
              <div>
                {item.yearlyProgress? roundTo2(item.yearlyProgress) + '%' : '-'}
              </div>
            </TableContentRow>
          );
        })}
        {/* <Wrapper>
          <Pagination
            total={pagination.totalCount}
            current={pagination.pageIndex - 1}
            pageSize={pagination.pageSize}
            gotoPage={page => {
              changePage(page + 1);
            }}
          />
          <div style={{ padding: '0 20px' }}>
            <PaginationDropdown
              value={pagination.pageSize}
              options={[
                { text: '10', value: 10 },
                { text: '20', value: 20 },
                { text: '30', value: 30 },
                { text: '50', value: 50 },
                { text: '100', value: 100 },
              ]}
              onChange={option => {
                changePage(1, option.value);
              }}
            />
            Showing {range} of {pagination.totalCount}
          </div>
        </Wrapper> */}
      </TableView>
    </>
  );
};

// const Wrapper = styled.div`
//   background: white;
//   padding-top: 5px;
//   padding-bottom: 20px;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-between;
// `;

export const TableRow = styled(BaseTableRow)`
  background-color: #F7F9FC;
  height: 50px;
  border-radius: 3px;
  padding: 10px 20px;
  margin-bottom: 5px;

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
  }
/*
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
  }*/
`;
