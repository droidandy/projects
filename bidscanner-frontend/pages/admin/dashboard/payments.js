// @flow
import React from 'react';

import { compose } from 'react-apollo';
import withData from 'lib/withData';

import { Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import Payments from 'components/admin-dashboard/Payments';

import sampleProps from 'components/admin-dashboard/sampleData/Payments';

const PaymentsPage = () =>
  <Layout title="Payments">
    <Container>
      <Box mt={3}>
        <Payments {...sampleProps} />
      </Box>
    </Container>
  </Layout>;

export default compose(withData)(PaymentsPage);
