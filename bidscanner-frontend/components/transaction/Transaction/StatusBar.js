import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

import RightArrowSVG from '../../svg/right-arrow.svg';

const StatusBar = styled(Flex)`border-bottom: 1px solid #e1e1e1;`;

const Status = styled.div`color: ${props => (props.chosen ? 'black' : '#BCBEC0')};`;

const Arrow = () => (
  <Box>
    <RightArrowSVG />
  </Box>
);

export default ({ currentStatus = 'Negotiation' }) => (
  <StatusBar mt={1} wrap px={1} py={5} justify="space-between">
    <Status chosen={currentStatus === 'Negotiation'}>Negotiation</Status>
    <Arrow />
    <Status chosen={currentStatus === 'Purchase Order'}>Purchase Order</Status>
    <Arrow />
    <Status chosen={currentStatus === 'Funds in Escrow'}>Funds in Escrow</Status>
    <Arrow />
    <Status chosen={currentStatus === 'Shipped'}>Shipped</Status>
    <Arrow />
    <Status chosen={currentStatus === 'Paid'}>Paid</Status>
  </StatusBar>
);
