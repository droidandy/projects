import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ChangeLog } from 'components';
import dispatchers from 'js/redux/admin/members.dispatchers';

function mapStateToProps(state) {
  return { items: state.members.changeLog };
}

class MemberChangeLog extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    memberId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    getLog: PropTypes.func
  };

  render() {
    const { memberId, getLog, items } = this.props;

    return <ChangeLog id={ memberId } getLog={ getLog } items={ items } />;
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(MemberChangeLog);
