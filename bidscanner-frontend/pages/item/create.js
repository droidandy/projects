// @flow
import React from 'react';

import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import { Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import GenerateItem from 'components/new-item/GenerateItem';

import sampleProps from 'components/new-item/sampleData/forGenerateItem';

const NewItemPage = () => (
  <Layout title="Create New Product">
    <Container>
      <Box my={3}>
        <GenerateItem {...sampleProps} />
      </Box>
    </Container>
  </Layout>
);

export default compose(withData, redirectIfNotLogged)(NewItemPage);
