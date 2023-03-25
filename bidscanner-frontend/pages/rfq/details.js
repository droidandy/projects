// @flow
import React from 'react';
import Container from 'components/styled/Container';
import { Box } from 'grid-styled';
import withData from 'lib/withData';
import Layout from 'components/Layout';
import RFQDetails from 'components/rfq-details/RFQDetails';
import sampleProps from 'components/rfq-details/sample-data/for-rfq-details';

const RFQ = () => (
  <Layout title="RFQ Details">
    <Container>
      <Box my={3}>
        <RFQDetails {...sampleProps} />
      </Box>
    </Container>
  </Layout>
);

export default withData(RFQ);
