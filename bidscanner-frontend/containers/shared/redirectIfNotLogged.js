import React, { Component } from 'react';
import Router from 'next/router';
import { graphql, gql } from 'react-apollo';

const query = gql`
  query me {
    me {
      id
    }
  }
`;

export default ChildComponent => {
  class RedirectIfNotLogged extends Component {
    static displayName = `RedirectIfNotLogged(${ChildComponent.displayName})`;

    render() {
      const { render, ...props } = this.props;

      if (!render) {
        // should't be here

        return null;
      }

      return <ChildComponent {...props} />;
    }
  }

  RedirectIfNotLogged.getInitialProps = async (ctx, cookies, apollo) => {
    const redirect = () => {
      if (process.browser) {
        Router.push('/general/home', '/');
      } else {
        ctx.res.redirect('/');
      }

      return {
        render: false,
      };
    };

    try {
      if (typeof cookies.get('token') === 'undefined') {
        return redirect();
      }

      await apollo.query({
        query,
      });

      let result = {
        render: true,
      };

      if (typeof ChildComponent.getInitialProps !== 'undefined') {
        result = {
          ...result,
          ...(await ChildComponent.getInitialProps(ctx, cookies, apollo)),
        };
      }

      return result;
    } catch (e) {
      return redirect();
    }
  };

  return graphql(query)(RedirectIfNotLogged);
};
