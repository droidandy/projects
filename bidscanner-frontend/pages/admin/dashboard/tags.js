// @flow
import React from 'react';

import { compose } from 'react-apollo';
import withData from 'lib/withData';

import { Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import Tags from 'components/admin-dashboard/Tags';

import sampleProps from 'components/admin-dashboard/sampleData/Tags';

const TagsPage = () =>
  <Layout title="Tags">
    <Container>
      <Box mt={3}>
        <Tags {...sampleProps} />
      </Box>
    </Container>
  </Layout>;

export default compose(withData)(TagsPage);
