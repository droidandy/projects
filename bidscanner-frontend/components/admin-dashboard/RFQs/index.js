// @flow
import React from 'react';
import styled from 'styled-components';

import format from 'date-fns/format';

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

const TagsContainer = styled.div`max-width: 240px;`;
const Tag = styled.span`white-space: nowrap;`;

const tag = subcategory =>
  <Tag key={subcategory.id}>
    #{subcategory.name}
  </Tag>;

type Props = {
  rfqs: any[],
};

export default ({ rfqs }: Props) =>
  <div>
    <Heading>RFQs</Heading>
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>ID</TableHeadCell>
          <TableHeadCell>Ship To</TableHeadCell>
          <TableHeadCell>Details</TableHeadCell>
          <TableHeadCell>Tags</TableHeadCell>
          <TableHeadCell>User ID</TableHeadCell>
          <TableHeadCell>Activity</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rfqs.map(rfq =>
          <TableRow>
            <TableCell>
              <DetailedData text={`RFQ: ${rfq.id}`}>
                <DetailedRow label="Posted">
                  {format(rfq.createdAt, 'DD/MM/YYYY')}
                </DetailedRow>
                <DetailedRow label="Closing">
                  {format(rfq.closingAt, 'DD/MM/YYYY')}
                </DetailedRow>
                <DetailedRow label="Delivery">
                  {format(rfq.deliveryAt, 'DD/MM/YYYY')}
                </DetailedRow>
              </DetailedData>
            </TableCell>
            <TableCell>
              <DetailedData text={rfq.shippingAddress.postalCode}>
                <DetailedRow label="Country">
                  {rfq.shippingAddress.country}
                </DetailedRow>
                <DetailedRow label="City">
                  {rfq.shippingAddress.city}
                </DetailedRow>
                <DetailedRow label="Street">
                  {rfq.shippingAddress.street}
                </DetailedRow>
              </DetailedData>
            </TableCell>
            <TableCell>
              {rfq.details.map(str =>
                <div>
                  {str}
                </div>
              )}
            </TableCell>
            <TableCell>
              <DetailedData text={rfq.subcategories.length}>
                <TagsContainer>
                  {rfq.subcategories.reduce(
                    (memo, subcategory) => (memo ? [...memo, ', ', tag(subcategory)] : [tag(subcategory)]),
                    null
                  )}
                </TagsContainer>
              </DetailedData>
            </TableCell>
            <TableCell>
              user: {rfq.user.id}
            </TableCell>
            <TableCell>
              <DetailedData text="activity">
                <DetailedRow label="Messages">
                  {rfq.messages.total}
                </DetailedRow>
                <DetailedRow label="Likes">
                  {rfq.likes}
                </DetailedRow>
                <DetailedRow label="Views">
                  {rfq.views}
                </DetailedRow>
                <DetailedRow label="Shares">
                  {rfq.shares}
                </DetailedRow>
              </DetailedData>
            </TableCell>
            <TableCell>
              <Switcher value={rfq.approved} onChange={() => {}} demo />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>;
