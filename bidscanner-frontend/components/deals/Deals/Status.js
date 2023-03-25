// @flow
import React from 'react';
import styled from 'styled-components';
import type { Status } from 'context/types';

const statusCircleSize = '0.5em';
const StatusCircle = styled.div`
  width: ${statusCircleSize};
  height: ${statusCircleSize};
  border-radius: calc(${statusCircleSize} / 2);
  margin-right: 1em;
  background-color: ${props => {
    switch (props.status) {
      case 'Shipped':
        return '#3DCA26';

      case 'Negotiation':
        return '#BCBEC0';

      case 'Funds in Escrow':
        return '#74BBE7';

      case 'Purchase Order':
        return '#000000';

      case 'Paid':
        return 'none';

      case 'Disputed':
        return '#FF2929';

      default:
        return 'none';
    }
  }};
  border: ${props => (props.status === 'Paid' ? '1px solid #979797' : null)};
`;
export type StatusProps = {
  status: Status,
};
export default ({ status }: StatusProps) => <StatusCircle status={status} />;
