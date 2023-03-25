import React from 'react';
import {
  Compare,
} from '@benrevo/benrevo-react-quote';

class ComparePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Compare
        { ...this.props }
      />
    )
  }
}

export default ComparePage;
