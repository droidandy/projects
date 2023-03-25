// @flow
import React from 'react';

import { compose } from 'react-apollo';
import withData from 'lib/withData';

import { Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import RFQs from 'components/admin-dashboard/RFQs';

import sampleProps from 'components/admin-dashboard/sampleData/RFQs';

const RFQsPage = () =>
  <Layout title="RFQs">
    <Container>
      <Box mt={3}>
        <RFQs {...sampleProps} />
      </Box>
    </Container>
  </Layout>;

export default compose(withData)(RFQsPage);
