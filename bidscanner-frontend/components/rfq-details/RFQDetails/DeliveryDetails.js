// @flow

import React from 'react';
import { Box } from 'grid-styled';
import styled from 'styled-components';

const StyledText = styled.span`font-size: 1em;`;
const RowWrapper = styled(Box)`
  padding-top: 1em;
`;

export type DeliveryDetailsProps = {
  expireTime: Date,
  deliveryDate: Date,
  shippingAddress: string,
};
export default ({ expireTime, deliveryDate, shippingAddress }: DeliveryDetailsProps) =>
  <Box>
    <RowWrapper>
      <StyledText>
        Closing {expireTime.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
      </StyledText>
    </RowWrapper>
    <RowWrapper>
      <StyledText>
        Delivery by {deliveryDate.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
      </StyledText>
    </RowWrapper>
    <RowWrapper>
      <StyledText>
        Ship to {shippingAddress}
      </StyledText>
    </RowWrapper>
  </Box>;
