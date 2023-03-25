// @flow
import React from 'react';
import styled from 'styled-components';

import format from 'date-fns/format';
import { formatPrice } from 'utils/formatters';

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
  products: any[],
};

export default ({ products }: Props) =>
  <div>
    <Heading>Products</Heading>
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>ID</TableHeadCell>
          <TableHeadCell>Pickup</TableHeadCell>
          <TableHeadCell>Details</TableHeadCell>
          <TableHeadCell>Tags</TableHeadCell>
          <TableHeadCell>User ID</TableHeadCell>
          <TableHeadCell>Activity</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map(product =>
          <TableRow>
            <TableCell>
              <DetailedData text={`product: ${product.id}`}>
                <DetailedRow label="Posted">
                  {format(product.createdAt, 'DD/MM/YYYY')}
                </DetailedRow>
                <DetailedRow label="Price">
                  {formatPrice(product.price.price, product.price.currency.code)}/{product.price.priceQuantityType}
                </DetailedRow>
                <DetailedRow label="Amount">
                  {product.price.quantity} {product.price.quantityType}
                </DetailedRow>
              </DetailedData>
            </TableCell>
            <TableCell>
              <DetailedData text={product.pickupAddress.postalCode}>
                <DetailedRow label="Country">
                  {product.pickupAddress.country}
                </DetailedRow>
                <DetailedRow label="City">
                  {product.pickupAddress.city}
                </DetailedRow>
                <DetailedRow label="Street">
                  {product.pickupAddress.street}
                </DetailedRow>
              </DetailedData>
            </TableCell>
            <TableCell>
              {product.type.name}
            </TableCell>
            <TableCell>
              <DetailedData text={product.subcategories.length}>
                <TagsContainer>
                  {product.subcategories.reduce(
                    (memo, subcategory) => (memo ? [...memo, ', ', tag(subcategory)] : [tag(subcategory)]),
                    null
                  )}
                </TagsContainer>
              </DetailedData>
            </TableCell>
            <TableCell>
              user: {product.user.id}
            </TableCell>
            <TableCell>
              <DetailedData text="activity">
                <DetailedRow label="Messages">
                  {product.messages.total}
                </DetailedRow>
                <DetailedRow label="Likes">
                  {product.likes}
                </DetailedRow>
                <DetailedRow label="Views">
                  {product.views}
                </DetailedRow>
                <DetailedRow label="Shares">
                  {product.shares}
                </DetailedRow>
              </DetailedData>
            </TableCell>
            <TableCell>
              <Switcher value={product.approved} onChange={() => {}} demo />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>;
