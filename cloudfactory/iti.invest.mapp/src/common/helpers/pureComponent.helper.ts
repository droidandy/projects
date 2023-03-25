import * as React from 'react';

export function pureComponent<P>(sfc: (props: P) => React.ReactNode) {
  class PureComponent extends React.PureComponent<P> {
    public render() {
      return sfc(this.props);
    }
  }

  return PureComponent;
}
