import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { getReportsPageState } from '../interface';
import { Link } from 'typeless-router';
import { ReportsPageFilter } from './ReportsPageFilter';
import styled from 'styled-components';
import { useLanguage } from 'src/hooks/useLanguage';
import { DocumentIcon, PdfDocumentIcon } from 'src/icons/DocumentIcons';

export const ReportsPage = () => {
  const {
    isLoading,
    sortType,
    sortBy,
    totalCount,
    pageIndex,
    pageSize,
  } = getReportsPageState.useState();
  const lang = useLanguage();
  const items = json.items;

  const columns: Array<Column<any>> = [
    {
      name: 'id',
      displayName: 'ID',
      sortable: true,
      renderCell: item => item.id,
    },
    {
      name: 'name',
      displayName: 'Name of report',
      sortable: true,
      renderCell: item => item.name[lang],
    },
    {
      name: 'createDate',
      displayName: 'Create Date',
      sortable: true,
      renderCell: item => {
        const date = item.createdDate.slice(0, 10).split('-');
        return date[2] + '-' + date[1] + '-' + date[0];
      },
    },
    {
      name: 'updateDate',
      displayName: 'Last Updated Date',
      sortable: true,
      renderCell: item => {
        const date = item.updatedDate.slice(0, 10).split('-');
        return date[2] + '-' + date[1] + '-' + date[0];
      },
    },
    {
      name: 'actions',
      displayName: 'Actions ',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link>
              <Icon className="flaticon2-trash" />
            </Link>
            <Link>
              <Icon className="flaticon2-note" />
            </Link>
            <Link href={`/reports-page/${item.id}`}>
              <Icon className="flaticon-eye" />
            </Link>
            <Link>
              <DocumentIcon />
            </Link>
            <Link>
              <Icon className="flaticon-multimedia" />
            </Link>
            <Link>
              <Icon className="flaticon2-file" />
            </Link>
            <Link>
              <PdfDocumentIcon />
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
          <SubHeader>Reports for Jul 2019 - Nov 2019</SubHeader>
          <ReportsPageFilter />
          <DataTable<any>
            sortBy={sortBy}
            sortDesc={sortType === 'DESC'}
            isLoading={isLoading}
            items={items}
            columns={columns}
            pageSize={pageSize}
            pageNumber={pageIndex - 1}
            total={totalCount}
            search={() => {}}
          />
        </Portlet>
      </Page>
    </>
  );
};

const SubHeader = styled.div`
  border-bottom: 1px solid #f2f3f8;
  border-radius: 5px 5px 0px 0px;
  background-color: #fff;
  padding: 15px 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-weight: bold;
`;
const Icon = styled.i`
 color: #646C9A
 margin: 0 5px
 `;

export const json = {
  items: [
    {
      description: {
        en: 'Description-Red KPIs Report',
        ar: '[ar] Description-Red KPIs Report',
      },
      name: {
        en: 'Red KPIs Report',
        ar: '[ar] Red KPIs Report',
      },
      createdDate: '2020-01-29T08:35:39.648446Z',
      updatedDate: '2020-01-29T08:35:39.648447Z',
      lastCalculatedDate: '0001-01-01T00:00:00Z',
      id: 1,
    },
    {
      description: {
        en: 'Description-Blue KPIs Report',
        ar: '[ar] Description-Blue KPIs Report',
      },
      name: {
        en: 'Blue KPIs Report',
        ar: '[ar] Blue KPIs Report',
      },
      createdDate: '2020-01-29T08:35:39.648446Z',
      updatedDate: '2020-01-29T08:35:39.648447Z',
      lastCalculatedDate: '0001-01-01T00:00:00Z',
      id: 2,
    },
    {
      description: {
        en: 'Description-Strategic KPIs Report',
        ar: '[ar] Description-Strategic KPIs Report',
      },
      name: {
        en: 'Strategic KPIs Report',
        ar: '[ar] Strategic KPIs Report',
      },
      createdDate: '2020-01-29T08:35:39.648446Z',
      updatedDate: '2020-01-29T08:35:39.648447Z',
      lastCalculatedDate: '0001-01-01T00:00:00Z',
      id: 3,
    },
    {
      description: {
        en: 'Description-Operational KPIs Report',
        ar: '[ar] Description-Operational KPIs Report',
      },
      name: {
        en: 'Operational KPIs Report',
        ar: '[ar] Operational KPIs Report',
      },
      createdDate: '2020-01-29T08:35:39.648446Z',
      updatedDate: '2020-01-29T08:35:39.648447Z',
      lastCalculatedDate: '0001-01-01T00:00:00Z',
      id: 4,
    },
    {
      description: {
        en: 'Description-All KPIs Report',
        ar: '[ar] Description-All KPIs Report',
      },
      name: {
        en: 'All KPIs Report',
        ar: '[ar] All KPIs Report',
      },
      createdDate: '2020-01-29T08:35:39.648446Z',
      updatedDate: '2020-01-29T08:35:39.648447Z',
      lastCalculatedDate: '0001-01-01T00:00:00Z',
      id: 5,
    },
    {
      description: {
        en: 'Description-Excellence Requirements Report',
        ar: '[ar] Description-Excellence Requirements Report',
      },
      name: {
        en: 'Excellence Requirements Report',
        ar: '[ar] Excellence Requirements Report',
      },
      createdDate: '2020-01-29T08:35:39.648446Z',
      updatedDate: '2020-01-29T08:35:39.648447Z',
      lastCalculatedDate: '0001-01-01T00:00:00Z',
      id: 6,
    },
    {
      description: {
        en: 'Description-Projects Report',
        ar: '[ar] Description-Projects Report',
      },
      name: {
        en: 'Projects Report',
        ar: '[ar] Projects Report',
      },
      createdDate: '2020-01-29T08:35:39.648446Z',
      updatedDate: '2020-01-29T08:35:39.648447Z',
      lastCalculatedDate: '0001-01-01T00:00:00Z',
      id: 7,
    },
  ],
};
