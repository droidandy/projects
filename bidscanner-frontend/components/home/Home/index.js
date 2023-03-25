// @flow
import React, { Component } from 'react';
import Router from 'next/router';

import DefaultHomeContainer from 'containers/home/Home/DefaultHomeContainer';
import SearchModeContainer from 'containers/home/Home/SearchModeContainer';

import Layout from 'components/Layout';

const replace = (realPathname, fakePathname, query) => {
  Router.replace(
    {
      pathname: realPathname,
      query,
    },
    {
      pathname: fakePathname,
      query,
    },
    { shallow: true }
  );
};

export default class Home extends Component {
  constructor() {
    super();
    this.switchedToSearchMode = false;
  }

  componentWillReceiveProps(nextProps) {
    const { query } = nextProps;
    const { string } = query;

    if (string && string.length > 3) {
      this.switchedToSearchMode = true;
    }

    if (JSON.stringify(query) !== JSON.stringify(this.prevQuery)) {
      this.prevQuery = query;

      if (this.switchedToSearchMode) {
        replace('/general/home', '/search', query);
      } else {
        replace('/general/home', '/', query);
      }
    }
  }

  render() {
    if (!this.switchedToSearchMode) {
      return (
        <Layout
          verticalCenter
          showText
          title="#1 European B2B Marketplace with Escrow Payment"
          description="The B2B marketplace for buyers and suppliers of industrial products and services. Find deals, buy and sell safely with our powerful escrow payment gateway"
          keywords="B2B marketplace, European marketplace, international trading, escrow payment"
        >
          <DefaultHomeContainer query={this.props.query} />
        </Layout>
      );
    }

    return (
      <Layout
        title="#1 European B2B Marketplace with Escrow Payment"
        description="The B2B marketplace for buyers and suppliers of industrial products and services. Find deals, buy and sell safely with our powerful escrow payment gateway"
        keywords="B2B marketplace, European marketplace, international trading, escrow payment"
      >
        <SearchModeContainer
          query={this.props.query}
          initialValues={{
            ...this.prevQuery,
            page: 1,
            'sort-by': 'Relevance',
          }}
        />
      </Layout>
    );
  }
}
