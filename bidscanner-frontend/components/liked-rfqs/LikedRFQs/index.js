import React, { Component } from 'react';
import Router from 'next/router';
import { Box } from 'grid-styled';
import styled from 'styled-components';

import Layout from 'components/Layout';
import Container from 'components/styled/Container';

import Filters from 'components/liked-rfqs/LikedRFQs/Filters';
import ListContainer from 'containers/liked-rfqs/LikedRFQs/ListContainer';

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
          pathname: '/user/liked/rfqs',
          query,
        },
        {
          pathname: '/private/rfqs/liked-rfqs',
          query,
        },
        { shallow: true }
      );
    }
  }

  render() {
    const { query } = this.props;
    return (
      <Layout title="Liked RFQs" showSearch>
        <Container>
          <Title mt={4}>My Liked RFQs</Title>
          <Filters />
          <ListContainer query={query} />
        </Container>
      </Layout>
    );
  }
}
