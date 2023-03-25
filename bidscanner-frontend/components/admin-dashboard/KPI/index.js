// @flow
import React from 'react';
import styled from 'styled-components';

import { formatPrice, formatNumber, formatPercent } from 'utils/formatters';

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

const TableRow = styled.tr``;
const DataRow = styled(TableRow)`
  height: 75px;
  font-weight: bold;

  td {
    padding-top: 25px;
  }
`;
const TotalRow = styled(TableRow)`
  height: 100px;
  font-size: 1.1em;
  font-weight: bold;
`;
const DiffRow = styled(TableRow)`
  height: 25px;
`;

const TableCell = styled.td`
  text-align: center;
  border: 1px solid #e1e1e1;
  padding: 3px 8px;
`;
const HeadCell = styled(TableCell)`
  text-align: left;
`;
const PostingsCell = styled(TableCell)`
  font-size: 0.8em;
`;
const SeparatorCol = styled(TableCell).attrs({ rowSpan: 11 })`
  width: 20px;
  max-width: 20px;
`;
const DiffHeadCell = styled(TableCell)`
  color: #bcbec0;
  font-size: 0.75em;
  text-align: left;
`;
const DiffCell = styled(TableCell)`
  color: ${props => (props.value < 0 ? '#FF2929' : '#3DCA26')};
  font-size: 0.75em;
`;

const renderDiffCell = value =>
  <DiffCell value={value}>
    {value > 0 && '+'}
    {formatPercent(value)}
  </DiffCell>;

type Props = {
  data: any,
};

export default ({ data }: Props) =>
  <div>
    <Heading>Key Performance Idicators</Heading>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell rowSpan="2" />
          <SeparatorCol />
          <TableCell rowSpan="2">Users</TableCell>
          <TableCell rowSpan="2">Companies</TableCell>
          <SeparatorCol />
          <TableCell colSpan="3">RFQs</TableCell>
          <SeparatorCol />
          <TableCell colSpan="3">Products</TableCell>
          <SeparatorCol />
          <TableCell rowSpan="2">$Postings</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Free</TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Free</TableCell>
        </TableRow>
        <TotalRow>
          <HeadCell>Total</HeadCell>
          <TableCell>
            {formatNumber(data.totals.users)}
          </TableCell>
          <TableCell>
            {formatNumber(data.totals.users)}
          </TableCell>
          <TableCell>
            {formatNumber(data.totals.rfqs.total)}
          </TableCell>
          <TableCell>
            {formatNumber(data.totals.rfqs.paid)}
          </TableCell>
          <TableCell>
            {formatNumber(data.totals.rfqs.free)}
          </TableCell>
          <TableCell>
            {formatNumber(data.totals.products.total)}
          </TableCell>
          <TableCell>
            {formatNumber(data.totals.products.paid)}
          </TableCell>
          <TableCell>
            {formatNumber(data.totals.products.free)}
          </TableCell>
          <PostingsCell>
            {formatPrice(data.totals.postings)}
          </PostingsCell>
        </TotalRow>
        {data.periods.map(period => [
          <DataRow>
            <HeadCell>
              Last {period.days} days
            </HeadCell>
            <TableCell>
              {formatNumber(period.users.value)}
            </TableCell>
            <TableCell>
              {formatNumber(period.companies.value)}
            </TableCell>
            <TableCell>
              {formatNumber(period.rfqs.total.value)}
            </TableCell>
            <TableCell>
              {formatNumber(period.rfqs.paid.value)}
            </TableCell>
            <TableCell>
              {formatNumber(period.rfqs.free.value)}
            </TableCell>
            <TableCell>
              {formatNumber(period.products.total.value)}
            </TableCell>
            <TableCell>
              {formatNumber(period.products.paid.value)}
            </TableCell>
            <TableCell>
              {formatNumber(period.products.free.value)}
            </TableCell>
            <PostingsCell>
              {formatPrice(period.postings.value)}
            </PostingsCell>
          </DataRow>,
          <DiffRow>
            <DiffHeadCell>vs. previous</DiffHeadCell>
            {renderDiffCell(period.users.diff)}
            {renderDiffCell(period.companies.diff)}
            {renderDiffCell(period.rfqs.total.diff)}
            {renderDiffCell(period.rfqs.paid.diff)}
            {renderDiffCell(period.rfqs.free.diff)}
            {renderDiffCell(period.products.total.diff)}
            {renderDiffCell(period.products.paid.diff)}
            {renderDiffCell(period.products.free.diff)}
            {renderDiffCell(period.postings.diff)}
          </DiffRow>,
        ])}
      </TableBody>
    </Table>
  </div>;
