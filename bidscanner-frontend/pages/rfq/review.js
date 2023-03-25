// @flow
import React from 'react';

import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import { Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import ReviewRFQ from 'components/new-rfq/ReviewRFQ';

import sampleProps from 'components/new-rfq/sampleData/forReviewRFQ';

const NewRFQPage = () => (
  <Layout title="Post RFQ">
    <Container>
      <Box my={3}>
        <ReviewRFQ {...sampleProps} />
      </Box>
    </Container>
  </Layout>
);

export default compose(withData, redirectIfNotLogged)(NewRFQPage);
