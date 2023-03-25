import { connect } from 'react-redux';
import dispatchers from 'js/redux/admin/members.dispatchers';
import MemberChangeLog from 'pages/shared/members/MemberChangeLog';

function mapStateToProps(state) {
  return { items: state.members.changeLog };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(MemberChangeLog);
