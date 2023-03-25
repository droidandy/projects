// @flow
import React from 'react';
import styled from 'styled-components';

import format from 'date-fns/format';

import { Flex, Box } from 'grid-styled';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from 'components/styled/table';
import Pagination from 'components/general/Pagination';

const Title = styled.h2`
  display: inline;
  font-size: 2em;
  font-weight: bold;
`;

const bills = [
  { id: '1', date: new Date(), number: 12, type: 'Urgent RFQ', amount: 4.99 },
  { id: '2', date: new Date(), number: 12, type: 'Urgent RFQ', amount: 4.99 },
  { id: '3', date: new Date(), number: 12, type: 'Urgent RFQ', amount: 4.99 },
  { id: '4', date: new Date(), number: 12, type: 'Urgent RFQ', amount: 4.99 },
  { id: '5', date: new Date(), number: 12, type: 'Urgent RFQ', amount: 4.99 },
  { id: '6', date: new Date(), number: 12, type: 'Urgent RFQ', amount: 4.99 },
];

type Props = {
  onPageChange: number => void,
  currentPage: number,
};

export default ({ onPageChange, currentPage }: Props) =>
  <div>
    <Box mb={3}>
      <Title>My Bills</Title>
    </Box>
    <Table>
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell>Invoice #</TableHeaderCell>
          <TableHeaderCell>Type</TableHeaderCell>
          <TableHeaderCell>Amount</TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {bills.map(bill =>
          <TableRow key={bill.id}>
            <TableCell>
              {format(bill.date, 'DD/MM/YYYY')}
            </TableCell>
            <TableCell>
              {bill.number}
            </TableCell>
            <TableCell>
              {bill.type}
            </TableCell>
            <TableCell>
              ${bill.amount}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    <Flex justify="center" mt={3}>
      <Pagination
        currentPageIndex={currentPage}
        numberOfPages={10}
        paginationWidth={6}
        onClick={onPageChange}
      />
    </Flex>
  </div>;
