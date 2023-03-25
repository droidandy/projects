import { connect } from 'react-redux';
import MemberChangeLog from 'pages/shared/members/MemberChangeLog';
import dispatchers from 'js/redux/app/bookers.dispatchers';

function mapStateToProps(state) {
  return { items: state.bookers.changeLog };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(MemberChangeLog);
