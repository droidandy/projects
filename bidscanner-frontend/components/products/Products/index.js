import React, { Component } from 'react';
import Router from 'next/router';
import { Box } from 'grid-styled';
import styled from 'styled-components';

import Layout from 'components/Layout';
import Container from 'components/styled/Container';

import Filters from 'components/products/Products/Filters';
import ListContainer from 'containers/products/Products/ListContainer';

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
          pathname: '/user/products',
          query,
        },
        {
          pathname: '/private/products/posted-products',
          query,
        },
        { shallow: true }
      );
    }
  }

  render() {
    const { query } = this.props;
    return (
      <Layout title="My Products" showSearch>
        <Container>
          <Title mt={4}>My Products</Title>
          <Filters />
          <ListContainer query={query} />
        </Container>
      </Layout>
    );
  }
}
