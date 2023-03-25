// @flow
import React from 'react';

import { compose } from 'react-apollo';
import withData from 'lib/withData';

import { Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import KPI from 'components/admin-dashboard/KPI';

import sampleProps from 'components/admin-dashboard/sampleData/KPI';

const KPIPage = () =>
  <Layout title="Key Performance">
    <Container>
      <Box mt={3}>
        <KPI {...sampleProps} />
      </Box>
    </Container>
  </Layout>;

export default compose(withData)(KPIPage);
