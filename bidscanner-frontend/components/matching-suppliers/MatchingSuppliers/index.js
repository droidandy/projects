import React, { Component } from 'react';
import Router from 'next/router';
import { Box } from 'grid-styled';
import styled from 'styled-components';

import Layout from 'components/Layout';
import Container from 'components/styled/Container';

import Filters from 'components/matching-suppliers/MatchingSuppliers/Filters';
import ListContainer from 'containers/matching-suppliers/MatchingSuppliers/ListContainer';

const Title = styled(Box)`
  font-size: 26px;
  font-weight: bold;
`;

export default class Search extends Component {
  componentWillReceiveProps(nextProps) {
    const { query } = nextProps;
    if (JSON.stringify(query) !== JSON.stringify(this.prevQuery)) {
      this.prevQuery = query;
      Router.replace(
        {
          pathname: '/rfq/suppliers',
          query,
        },
        {
          pathname: '/matching-suppliers',
          query,
        },
        { shallow: true }
      );
    }
  }

  render() {
    const { query } = this.props;
    return (
      <Layout title="Matching Suppliers">
        <Container>
          <Title mt={4}>Matching Suppliers</Title>
          <Filters />
          <ListContainer query={query} />
        </Container>
      </Layout>
    );
  }
}
