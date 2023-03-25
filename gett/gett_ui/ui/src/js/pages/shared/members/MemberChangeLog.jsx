import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ChangeLog } from 'components';

export default class MemberChangeLog extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    getLog: PropTypes.func,
    memberId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
  };

  render() {
    const { memberId, getLog, items } = this.props;

    return <ChangeLog id={ memberId } getLog={ getLog } items={ items } />;
  }
}
