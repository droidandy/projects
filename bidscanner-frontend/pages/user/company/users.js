// @flow
import React from 'react';

import compose from 'recompose/compose';
import withPagination from 'utils/hoc/withPagination';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import { Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import MyCompanyUsers from 'components/company/Users/index';

type Props = {
  onPageChange: number => void,
  currentPage: number,
};

const MyCompanyUsersPage = ({ onPageChange, currentPage }: Props) => (
  <Layout title="Users Management">
    <Container>
      <Box my={3}>
        <MyCompanyUsers onPageChange={onPageChange} currentPage={currentPage} />
      </Box>
    </Container>
  </Layout>
);

export default compose(withPagination(), withData, redirectIfNotLogged)(MyCompanyUsersPage);
