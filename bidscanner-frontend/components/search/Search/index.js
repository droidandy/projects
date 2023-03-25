import React, { Component } from 'react';
import Router from 'next/router';

import Layout from 'components/Layout';
import Container from 'components/styled/Container';

import Filters from 'components/search/Search/Filters';
import ListContainer from 'containers/search/Search/ListContainer';

const fakePathnameConstructor = (publ, entity) => {
  switch (entity) {
    case 'Products':
      return `/${publ}/search/product-sale`;
    case 'Requests':
      return `/${publ}/search/buy-requests`;
    case 'Suppliers':
      return `/${publ}/search/suppliers`;
    default:
      return '/search';
  }
};

export default class Search extends Component {
  constructor(props) {
    super(props);

    const { url: { query: { publ } } } = props;
    this.publ = publ;
  }

  componentWillReceiveProps(nextProps) {
    const { query } = nextProps;

    const { entity } = query;
    this.fakePathname = fakePathnameConstructor(this.publ, entity);

    if (JSON.stringify(query) !== JSON.stringify(this.prevQuery)) {
      this.prevQuery = query;
      Router.replace(
        {
          pathname: '/general/search',
          query,
        },
        {
          pathname: this.fakePathname,
          query,
        },
        { shallow: true }
      );
    }
  }

  render() {
    const { query } = this.props;
    return (
      <Layout title="Search">
        <Container>
          <Filters />
          <ListContainer query={query} />
        </Container>
      </Layout>
    );
  }
}
