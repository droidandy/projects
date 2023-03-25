import { connect } from 'react-redux';
import MemberChangeLog from 'pages/shared/members/MemberChangeLog';
import dispatchers from 'js/redux/app/passengers.dispatchers';

function mapStateToProps(state) {
  return { items: state.passengers.changeLog };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(MemberChangeLog);
