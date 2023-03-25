// @flow
import { Component } from 'react';
import Router from 'next/router';

import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';
import createEagerFactory from 'recompose/createEagerFactory';

const withPagination = () => (BaseComponent: Class<React$Component<*, *, *>>) => {
  const factory = createEagerFactory(BaseComponent);

  class WithPagination extends Component {
    state = { refs: {} };

    onPageChange = (pageNum: number) => {
      const { url } = this.props;

      Router.replace(
        {
          pathname: url.pathname,
          query: { ...url.query, page: pageNum },
        },
        undefined,
        { shallow: true }
      );
    };

    render() {
      return factory({
        ...this.props,
        currentPage: this.props.url.query.page || 1,
        onPageChange: this.onPageChange,
      });
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withPagination'))(WithPagination);
  }

  return WithPagination;
};

export default withPagination;
