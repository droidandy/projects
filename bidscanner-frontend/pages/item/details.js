// @flow
import React from 'react';
import { Box } from 'grid-styled';
import withData from 'lib/withData';

import Container from 'components/styled/Container';

import Layout from 'components/Layout';
import ItemDetails from 'components/item-details/ItemDetails';

import sampleData from 'components/item-details/sample-data/for-item-details';

const ItemDetailsPage = () => (
  <Layout title="Product Detail">
    <Container>
      <Box my={3}>
        <ItemDetails {...sampleData} />
      </Box>
    </Container>
  </Layout>
);

export default withData(ItemDetailsPage);
