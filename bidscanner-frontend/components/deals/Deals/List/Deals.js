// @flow
import React from 'react';
import { Flex, Box, Grid } from 'grid-styled';
import styled from 'styled-components';
import Status from 'components/deals/Deals/Status';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const NotReadTableRow = styled(TableRow)`
  font-weight: 'bold';
  font-size: 1em;
`;

const ReadTableRow = styled(TableRow)`
  font-weight: 'bold';
  font-size: 1em;
`;

const Image = styled.img`
  width: 3em;
  height: 3em;
  border-radius: 0.2em;
  @media (max-width: 1000px) {
    display: none;
  }
`;

const UserColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 3em);
`;
const CompanyName = styled.div`font-weight: normal;`;
const StatusWrapper = styled.div`@media (max-width: 1000px) {display: none;}`;

export type DealsProps = {
  deals: Array<{
    id: number,
    image: string,
    name: string,
    company: string,
    reference: string,
    date: Date,
    status: string,
    read: boolean,
  }>,
};

export default ({ deals }: DealsProps) => {
  // sort messages by prop 'read'
  const dealsData = [].concat(deals).sort((a, b) => a.read > b.read);
  return (
    <Box>
      <Table showCheckboxes={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn colSpan="1" style={{ paddingLeft: 0 }}>
              ID
            </TableHeaderColumn>
            <TableHeaderColumn colSpan="3">
              <Flex>
                <Grid width={1 / 4} />User
              </Flex>
            </TableHeaderColumn>
            <TableHeaderColumn colSpan="4">Reference</TableHeaderColumn>
            <TableHeaderColumn colSpan="2">Date</TableHeaderColumn>
            <TableHeaderColumn colSpan="2">Status</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {dealsData.map(
            (deal, index) =>
              !deal.read
                ? <NotReadTableRow key={`deal-${index}`}>
                    <TableRowColumn colSpan="1" style={{ paddingLeft: 0 }}>
                      {deal.id}
                    </TableRowColumn>
                    <TableRowColumn colSpan="3">
                      <Flex>
                        <Box width={(0, 0, 1 / 4)}>
                          <Image src={deal.image} alt="Sample" />
                        </Box>
                        <UserColumn>
                          <span>
                            {deal.name}
                          </span>
                          <CompanyName>
                            @{deal.company}
                          </CompanyName>
                        </UserColumn>
                      </Flex>
                    </TableRowColumn>
                    <TableRowColumn colSpan="4">
                      {deal.reference}
                    </TableRowColumn>
                    <TableRowColumn colSpan="2">
                      {deal.date.toLocaleDateString('en-US')}
                    </TableRowColumn>
                    <TableRowColumn colSpan="2">
                      <Flex align="center">
                        <StatusWrapper>
                          <Status status={deal.status} />
                        </StatusWrapper>
                        {deal.status}
                      </Flex>
                    </TableRowColumn>
                  </NotReadTableRow>
                : <ReadTableRow key={`deal-${index}`}>
                    <TableRowColumn colSpan="1" style={{ paddingLeft: 0 }}>
                      {deal.id}
                    </TableRowColumn>
                    <TableRowColumn colSpan="3">
                      <Flex>
                        <Box width={(0, 0, 1 / 4)}>
                          <Image src={deal.image} alt="Sample" />
                        </Box>
                        <UserColumn>
                          <span>
                            {deal.name}
                          </span>
                          <CompanyName>
                            @{deal.company}
                          </CompanyName>
                        </UserColumn>
                      </Flex>
                    </TableRowColumn>
                    <TableRowColumn colSpan="4">
                      {deal.reference}
                    </TableRowColumn>
                    <TableRowColumn colSpan="2">
                      {deal.date.toLocaleDateString('en-US')}
                    </TableRowColumn>
                    <TableRowColumn colSpan="2">
                      <Flex align="center">
                        <StatusWrapper>
                          <Status status={deal.status} />
                        </StatusWrapper>
                        {deal.status}
                      </Flex>
                    </TableRowColumn>
                  </ReadTableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
