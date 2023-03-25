import React from 'react';
import { getReportsState, ReportsActions } from '../interface';
import styled from 'styled-components';
import { ReportsFilters } from './ReportsFilters';
import { useActions } from 'typeless';
import {
  DocumentIcon,
  TrashIcon,
  EditIcon,
  EyeIcon,
  FileIcon,
  PdfDocumentIcon,
  MessageIcon,
} from 'src/components/ReportsIcons';
import { TableView } from 'src/components/TableView';
import { useTranslation } from 'react-i18next';
import { BaseTableRow } from 'src/components/BaseTableRow';
import { useSticky } from 'src/hooks/useSticky';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Pagination } from 'src/components/Pagination';
import { _getCriteria } from '../module';
import { Spinner } from 'src/components/Spinner';
import { PaginationDropdown } from 'src/components/PaginationDropdown';
import { FilterToggle } from 'src/components/FilterToggle';

const Cell = styled.div<{ center?: boolean }>`
  font-weight: bold;
  ${props => props.center && 'text-align: center'};
`;

export function TableColumns() {
  const { t } = useTranslation();
  const sticky = useSticky();
  const titleArray = ['ID', 'Name of report', 'Type', 'Actions'];

  return (
    <TableRow sticky={sticky}>
      {titleArray.map(title => {
        return <Cell key={title}>{t(title)}</Cell>;
      })}
    </TableRow>
  );
}

const createUrl = (item: any) => {
  const { params: values } = item;
  let url = '';
  if (item.type === 'KPI' || item.type === 'Excellence') {
    item.type === 'KPI'
      ? (url = '/kpi-reports')
      : (url = '/excellence-reports');
    const params: any = {};
    Object.keys(values).forEach(key => {
      if (values[key]) {
        params[key] = values[key];
      }
    });
    const paramsArr = Object.entries(params);

    if (paramsArr.length) {
      url =
        url +
        '?' +
        paramsArr
          .map((el: [string, string | []]) => {
            return typeof el[1] === 'string' || typeof el[1] === 'number'
              ? `${el[0]}=${el[1]}`
              : `${el[0]}=${el[1]!.join(',')}`;
          })
          .join('&');
    }
  } else {
    url = '/manual-reports';
  }

  return url;
};

export const Reports = () => {
  const { t } = useTranslation();
  const {
    items,
    isLoading,
    pagination,
    isLoadingDocument,
    isFilterExpanded,
  } = getReportsState.useState();
  const { changePage, downloadDocument, setIsFilterExpanded } = useActions(
    ReportsActions
  );
  const range = `${(pagination.pageIndex - 1) * pagination.pageSize +
    1}-${Math.min(
    pagination.totalCount,
    pagination.pageIndex * pagination.pageSize
  )}`;
  const options = [
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: '30', value: 30 },
    { text: '50', value: 50 },
    { text: '100', value: 100 },
  ];
  const title = t(`Reports`);

  return (
    <div style={{ opacity: isLoadingDocument ? 0.3 : 1 }}>
      {isLoadingDocument ? <DownloadSpinner black size="40px" /> : null}
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
            <ReportsFilters />
            <TableColumns />
          </>
        }
        isLoading={isLoading}
      >
        {items.map((item: any) => {
          return (
            <TableContentRow key={item.id}>
              <div>{item.id}</div>
              <a href={createUrl(item)}>
                <div>
                  <strong>
                    <DisplayTransString value={item.name} />
                  </strong>
                </div>
              </a>
              <div>{item.type ? item.type : '-'}</div>
              <div>
                <a
                  onClick={() =>
                    downloadDocument(
                      item.params.fileType,
                      item.params.language,
                      item.id
                    )
                  }
                >
                  {PdfDocumentIcon()}
                </a>
                <a>{FileIcon()}</a>
                <a>{MessageIcon()}</a>
                <a>{DocumentIcon()}</a>
                <a href={`/reports/${item.id}`}>{EyeIcon()}</a>
                <a>{EditIcon()}</a>
                <a>{TrashIcon()}</a>
              </div>
            </TableContentRow>
          );
        })}
        <Wrapper>
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
              options={options}
              onChange={option => {
                changePage(1, option.value as number);
              }}
            />
            Showing {range} of {pagination.totalCount}
          </div>
        </Wrapper>
      </TableView>
    </div>
  );
};

const DownloadSpinner = styled(Spinner)`
  position: fixed;
  right: 50%;
  top: 50%;
  display: block;
  z-index: 999999;
`;

const Wrapper = styled.div`
  background: white;
  padding-top: 5px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TableRow = styled(BaseTableRow)`
  background-color: #F7F9FC;
  height: 50px;
  & > div {
    flex-shrink: 0;
    width: 130px;
  }
  & > :nth-child(1) {
    width: 40px;
  }
  & > :nth-child(2) {
    flex: 1 0 0;
  }
  & > :nth-child(4) {
    text-align: center;
    margin: 0px 30px;
    width: 160px;
  }
`;

export const TableContentRow = styled(BaseTableRow)`
  border-bottom: 1px solid #F2F3F8;
  & > div {
    flex-shrink: 0;
    width: 130px;
  }

  & > a {
    color: #646c9a;
  }

  & > :nth-child(1) {
    width: 40px;
  }

  & > :nth-child(2) {
    flex: 1 0 0;
  }
  & > :nth-child(4) {
    text-align: center;
    margin: 0px 30px;
    width: 160px;
  }
`;
