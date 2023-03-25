// @flow
import React from 'react';
import styled from 'styled-components';

import format from 'date-fns/format';

import Switcher from 'components/forms-components/Switcher';

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
  manufacturers: any[],
};

export default ({ manufacturers }: Props) =>
  <div>
    <Heading>Manufacturers</Heading>
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Manufacturer</TableHeadCell>
          <TableHeadCell>Date</TableHeadCell>
          <TableHeadCell>User ID</TableHeadCell>
          <TableHeadCell>Product ID</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {manufacturers.map(manufacturer =>
          <TableRow>
            <TableCell>
              {manufacturer.title}
            </TableCell>
            <TableCell>
              {format(manufacturer.createdAt, 'DD/MM/YYYY')}
            </TableCell>
            <TableCell>
              user: {manufacturer.user.id}
            </TableCell>
            <TableCell>
              product: {manufacturer.product.id}
            </TableCell>
            <TableCell>
              <Switcher value={manufacturer.approved} onChange={() => {}} demo />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>;
