// @flow
import React from 'react';

import { compose } from 'react-apollo';
import withData from 'lib/withData';

import { Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import Users from 'components/admin-dashboard/Users';

import sampleProps from 'components/admin-dashboard/sampleData/Users';

const UsersPage = () =>
  <Layout title="Users">
    <Container>
      <Box mt={3}>
        <Users {...sampleProps} />
      </Box>
    </Container>
  </Layout>;

export default compose(withData)(UsersPage);
