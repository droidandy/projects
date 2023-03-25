// @flow
import React from 'react';
import styled from 'styled-components';

import format from 'date-fns/format';
import { formatRating } from 'utils/formatters';

import WhiteButton from 'components/styled/WhiteButton';
import Switcher from 'components/forms-components/Switcher';
import DetailedData from '../DetailedData';
import DetailedRow from '../DetailedData/DetailedRow';

const Heading = styled.h1`
  font-size: 1.8em;
  margin-bottom: 1.5em;
  font-weight: bold;
`;

const Table = styled.table`
  width: 100%;
  font-size: 16px;
`;
const TableBody = styled.tbody``;
const TableHead = styled.thead``;

const TableRow = styled.tr`height: 50px;`;

const TableHeadCell = styled.th`
  text-align: center;
  border: 1px solid #bcbec0;
  font-weight: normal;
`;
const TableCell = styled.td`
  text-align: center;
  border: 1px solid #bcbec0;
  font-weight: bold;
`;

type Props = {
  users: any[],
};

export default ({ users }: Props) =>
  <div>
    <Heading>Users</Heading>
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>ID</TableHeadCell>
          <TableHeadCell>User</TableHeadCell>
          <TableHeadCell>Company</TableHeadCell>
          <TableHeadCell>
            RFQs/<br />Products
          </TableHeadCell>
          <TableHeadCell>Activity</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell>Notes</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map(user =>
          <TableRow>
            <TableCell>
              user: {user.id}
            </TableCell>
            <TableCell>
              <DetailedData text={user.name}>
                <DetailedRow label="Registered">
                  {format(user.createdAt, 'DD/MM/YYYY')}
                </DetailedRow>
                <DetailedRow label="Email">
                  {user.email}
                </DetailedRow>
                <DetailedRow label="Phone">
                  {user.phone}
                </DetailedRow>
              </DetailedData>
            </TableCell>
            <TableCell>
              <DetailedData text={user.company.title}>
                <DetailedRow label="County">
                  {user.company.country}
                </DetailedRow>
                <DetailedRow label="Type">
                  {user.company.type}
                </DetailedRow>
                <DetailedRow label="Site">
                  {user.company.site}
                </DetailedRow>
              </DetailedData>
            </TableCell>
            <TableCell>
              <DetailedData text={user.rfqCounts.total}>
                <DetailedRow label="Total RFQs">
                  {user.rfqCounts.total}
                </DetailedRow>
                <DetailedRow label="Paid RFQs">
                  {user.rfqCounts.paid}
                </DetailedRow>
                <DetailedRow label="Free RFQs">
                  {user.rfqCounts.free}
                </DetailedRow>
              </DetailedData>
              <br />
              <DetailedData text={user.productCounts.total}>
                <DetailedRow label="Total Products">
                  {user.productCounts.total}
                </DetailedRow>
                <DetailedRow label="Paid Products">
                  {user.productCounts.paid}
                </DetailedRow>
                <DetailedRow label="Free Products">
                  {user.productCounts.free}
                </DetailedRow>
              </DetailedData>
            </TableCell>
            <TableCell>
              <DetailedData text={formatRating(user.rating)}>
                <DetailedRow label="Rating">
                  {formatRating(user.rating)}
                </DetailedRow>
                <DetailedRow label="Messages">
                  {user.messages.total}
                </DetailedRow>
                <DetailedRow label="# Reports">
                  {user.reports.total > 0 ? user.reports.total : '-'}
                </DetailedRow>
                <DetailedRow label="# Blocks">
                  {user.blocks.total > 0 ? user.blocks.total : '-'}
                </DetailedRow>
              </DetailedData>
            </TableCell>
            <TableCell>
              <Switcher value={!user.isBlocked} onChange={() => {}} demo />
            </TableCell>
            <TableCell>
              <WhiteButton>notes</WhiteButton>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>;
