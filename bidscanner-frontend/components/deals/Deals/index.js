import React, { Component } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';

import Layout from 'components/Layout';
import Container from 'components/styled/Container';

import FilterDealType from 'components/forms-components/dropdowns/FilterDealType';

import ListContainer from 'containers/deals/Deals/ListContainer';
import Filters from 'components/deals/Deals/Filters';

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
          pathname: '/user/deals',
          query,
        },
        {
          pathname: '/private/transactions',
          query,
        },
        { shallow: true }
      );
    }
  }

  render() {
    const { query, deals } = this.props;

    return (
      <Layout title="My Transactions">
        <Container>
          <Flex mt={4} align="flex-end">
            <Title>My Deals</Title>
            <Box mb="3px" ml={3}>
              <Field name="type" component={FilterDealType} />
            </Box>
          </Flex>
          <Filters query={query} />
          <ListContainer query={query} deals={deals} />
        </Container>
      </Layout>
    );
  }
}
