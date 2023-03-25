// @flow
import React from 'react';
import styled from 'styled-components';

import format from 'date-fns/format';

import { formatPrice } from 'utils/formatters';

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
  payments: any[],
};

export default ({ payments }: Props) =>
  <div>
    <Heading>Payments</Heading>
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Payment ID</TableHeadCell>
          <TableHeadCell>Date</TableHeadCell>
          <TableHeadCell>User ID</TableHeadCell>
          <TableHeadCell>Product ID</TableHeadCell>
          <TableHeadCell>Amount</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {payments.map(payment =>
          <TableRow>
            <TableCell>
              payment: {payment.id}
            </TableCell>
            <TableCell>
              {format(payment.createdAt, 'DD/MM/YYYY')}
            </TableCell>
            <TableCell>
              user: {payment.user.id}
            </TableCell>
            <TableCell>
              product: {payment.product.id}
            </TableCell>
            <TableCell>
              {formatPrice(payment.amount)}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>;
