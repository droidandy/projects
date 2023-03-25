// @flow
import React from 'react';

import { compose } from 'react-apollo';
import withData from 'lib/withData';

import { Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import Products from 'components/admin-dashboard/Products';

import sampleProps from 'components/admin-dashboard/sampleData/Products';

const ProductsPage = () =>
  <Layout title="Products">
    <Container>
      <Box mt={3}>
        <Products {...sampleProps} />
      </Box>
    </Container>
  </Layout>;

export default compose(withData)(ProductsPage);
