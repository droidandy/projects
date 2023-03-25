import { connect } from 'react-redux';
import { PassengerDetails } from 'pages/shared/passengers/components';
import dispatchers from 'js/redux/admin/members.dispatchers';

function mapStateToProps(state) {
  return {
    stats: state.members.currentStats
  };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(PassengerDetails);
