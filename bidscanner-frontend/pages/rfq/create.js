// @flow
import React from 'react';

import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import { Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import GenerateRFQ from 'components/new-rfq/GenerateRFQ';

import sampleProps from 'components/new-rfq/sampleData/forGenerateRFQ';

const NewRFQPage = () => (
  <Layout title="Create New RFQ">
    <Container>
      <Box my={3}>
        <GenerateRFQ {...sampleProps} />
      </Box>
    </Container>
  </Layout>
);

export default compose(withData, redirectIfNotLogged)(NewRFQPage);
