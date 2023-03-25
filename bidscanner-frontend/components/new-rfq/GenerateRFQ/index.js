// @flow
import React from 'react';
import styled from 'styled-components';

import { Flex, Box } from 'grid-styled';
import LinearProgress from 'material-ui/LinearProgress';
import Heading from 'components/styled/Heading';
import MutedText from 'components/styled/MutedText';
// import CompletionStatus from 'components/general/CompletionStatus';
import FormContainer, { type GenerateFormProps } from 'containers/new-rfq/GenerateRFQ/FormContainer';
import ProductCard from './ProductCard';
import DownIcon from './down.svg';

const LimitedBox = styled(Box)`
  width: 100%;
  max-width: 450px;
`;

const CenteredBox = styled(Box)`
  text-align: center;
  line-height: 0.75em;
`;

const StyledProgress = styled(LinearProgress).attrs({
  color: '#74BBE7',
})`
  height: 2px !important;
`;

export type GenerateRFQProps = GenerateFormProps & {
  recommendedProducts: any[],
};

export default ({ categories, recommendedProducts }: GenerateRFQProps) =>
  <Flex wrap>
    <LimitedBox w={1} mb={2}>
      <MutedText.Box>Completeness %</MutedText.Box>
      <CenteredBox>
        <MutedText>50%</MutedText>
        <br />
        <DownIcon fill="#BCBEC0" height="10" viewBox="0 4 24 14" width="24" />
      </CenteredBox>
      <Box>
        <StyledProgress mode="determinate" max={1} value={0.5} />
      </Box>
    </LimitedBox>
    <Box w={1} mb={2}>
      <Heading align="left" bold>
        New RFQ
      </Heading>
    </Box>
    <Box w={[1, 1, 'auto']} flex="1 1 auto" mb={[3, 3, 0]}>
      <FormContainer categories={categories} />
    </Box>
    <Box w={[1, 1, '145px']} ml={[0, 0, 2]}>
      <MutedText.Box mb={1}>Recommended products:</MutedText.Box>
      {recommendedProducts.map(product =>
        <Box key={product.id} mb={2} mr={2}>
          <ProductCard {...product} />
        </Box>
      )}
    </Box>
  </Flex>;
