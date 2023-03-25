import { Component } from 'react';
import isEqual from 'react-fast-compare';

export default class FastComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }
}
