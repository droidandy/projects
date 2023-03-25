import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DoneAll, Done } from '@material-ui/icons';

export default class MessageStatus extends Component {
  static propTypes = {
    isReadByAll: PropTypes.number,
    mocked: PropTypes.bool,
  };

  static defaultProps = {
    isReadByAll: 0,
    mocked: false,
  };

  render() {
    const { mocked, isReadByAll } = this.props;
    const Component = isReadByAll ? DoneAll : Done;

    return !mocked && (
      <div className="checkMark">
        <Component className="icon" />
      </div>
    );
  }
}
