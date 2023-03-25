import React, { Component } from 'react';
import Router from 'next/router';
import { Box } from 'grid-styled';
import styled from 'styled-components';

import Layout from 'components/Layout';
import Container from 'components/styled/Container';

import Filters from 'components/suggested-rfqs/SuggestedRFQs/Filters';
import ListContainer from 'containers/suggested-rfqs/SuggestedRFQs/ListContainer';

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
          pathname: '/user/suggested/rfqs',
          query,
        },
        {
          pathname: '/private/rfqs/matching-rfqs',
          query,
        },
        { shallow: true }
      );
    }
  }

  render() {
    const { query } = this.props;
    return (
      <Layout title="Matching RFQs" showSearch>
        <Container>
          <Title mt={4}>Suggested RFQs</Title>
          <Filters />
          <ListContainer query={query} />
        </Container>
      </Layout>
    );
  }
}
