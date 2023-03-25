import { connect } from 'react-redux';
import { PassengerDetails } from 'pages/shared/passengers/components';
import dispatchers from 'js/redux/app/passengers.dispatchers';

function mapStateToProps(state) {
  return {
    stats: state.passengers.currentStats
  };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(PassengerDetails);
