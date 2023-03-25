// @flow
import React from 'react';

import { compose } from 'react-apollo';
import withData from 'lib/withData';

import { Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import Manufacturers from 'components/admin-dashboard/Manufacturers';

import sampleProps from 'components/admin-dashboard/sampleData/Manufacturers';

const ManufacturersPage = () =>
  <Layout title="Manufacturers">
    <Container>
      <Box mt={3}>
        <Manufacturers {...sampleProps} />
      </Box>
    </Container>
  </Layout>;

export default compose(withData)(ManufacturersPage);
