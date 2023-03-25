// @flow
import React from 'react';
import styled from 'styled-components';

import format from 'date-fns/format';

import { Flex } from 'grid-styled';
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

const users = [
  {
    id: '1',
    name: 'Derill Sanders',
    email: 'email@gmail.com',
    inviteDate: null,
    joinDate: null,
    request: true,
    joined: false,
    rejected: false,
    company: 'pipingonline',
  },
  {
    id: '2',
    name: 'Derill Sanders',
    email: 'email@gmail.com',
    inviteDate: null,
    joinDate: null,
    request: true,
    joined: false,
    rejected: false,
    company: 'pipingonline',
  },
  {
    id: '3',
    name: 'Derill Sanders',
    email: 'email@gmail.com',
    inviteDate: null,
    joinDate: null,
    request: true,
    joined: false,
    rejected: false,
    company: 'pipingonline',
  },
  {
    id: '4',
    name: 'Derill Sanders',
    email: 'email@gmail.com',
    inviteDate: new Date(),
    joinDate: new Date(),
    request: false,
    joined: true,
    rejected: false,
    company: 'pipingonline',
  },
  {
    id: '5',
    name: 'Derill Sanders',
    email: 'email@gmail.com',
    inviteDate: new Date(),
    joinDate: new Date(),
    request: false,
    joined: true,
    rejected: false,
    company: 'pipingonline',
  },
  {
    id: '6',
    name: 'Derill Sanders',
    email: 'email@gmail.com',
    inviteDate: null,
    joinDate: new Date(),
    request: false,
    joined: true,
    rejected: false,
    company: 'pipingonline',
  },
  {
    id: '7',
    name: 'Derill Sanders',
    email: 'email@gmail.com',
    inviteDate: null,
    joinDate: new Date(),
    request: false,
    joined: true,
    rejected: false,
    company: 'pipingonline',
  },
  {
    id: '8',
    name: 'Derill Sanders',
    email: 'email@gmail.com',
    inviteDate: null,
    joinDate: null,
    request: false,
    joined: false,
    rejected: true,
    company: 'pipingonline',
  },
  {
    id: '9',
    name: 'Derill Sanders',
    email: 'email@gmail.com',
    inviteDate: new Date(),
    joinDate: new Date(),
    request: false,
    joined: true,
    rejected: false,
    company: 'pipingonline',
  },
];

const UsersTableRow = styled(TableRow)`
  font-weight: ${props => (props.request ? 'bold' : 'normal')};
`;

const Name = styled.div`font-weight: bold;`;
const Subtitle = styled.div`font-weight: normal;`;

type Props = {
  onPageChange: number => void,
  currentPage: number,
};

export default ({ onPageChange, currentPage }: Props) =>
  <div>
    <Table>
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell />
          <TableHeaderCell>User</TableHeaderCell>
          <TableHeaderCell>Email</TableHeaderCell>
          <TableHeaderCell>Invite Date</TableHeaderCell>
          <TableHeaderCell>Join Date</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {users.map(user =>
          <UsersTableRow key={user.id} request={user.request}>
            <TableCell>
              <img src="https://placeimg.com/50/50/people" alt={user.name} />
            </TableCell>
            <TableCell>
              <Name>
                {user.name}
              </Name>
              <Subtitle>
                @{user.company}
              </Subtitle>
            </TableCell>
            <TableCell>
              {user.email}
            </TableCell>
            <TableCell>
              {user.inviteDate && format(user.inviteDate, 'DD/MM/YYYY')}
            </TableCell>
            <TableCell>
              {user.joinDate && format(user.joinDate, 'DD/MM/YYYY')}
            </TableCell>
            <TableCell>
              {user.name}
            </TableCell>
          </UsersTableRow>
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
