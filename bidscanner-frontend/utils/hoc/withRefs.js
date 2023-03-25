// @flow
import { Component } from 'react';

import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';
import createEagerFactory from 'recompose/createEagerFactory';

const withRefs = () => (BaseComponent: Class<React$Component<*, *, *>>) => {
  const factory = createEagerFactory(BaseComponent);

  class WithRefs extends Component {
    state = { refs: {} };

    setters = {};

    setRef = (name: string) => {
      if (!this.setters[name]) {
        this.setters[name] = el => this.setState(({ refs }) => ({ refs: { ...refs, [name]: el } }));
      }

      return this.setters[name];
    };

    render() {
      return factory({
        ...this.props,
        refs: this.state.refs,
        setRef: this.setRef,
      });
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withRefs'))(WithRefs);
  }

  return WithRefs;
};

export default withRefs;
