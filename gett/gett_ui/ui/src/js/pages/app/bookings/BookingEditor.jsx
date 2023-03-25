import { connect } from 'react-redux';
import BookingEditor from 'pages/shared/bookings/BookingEditor';
import dispatchers from 'js/redux/app/bookings.dispatchers';

function mapStateToProps(state, { match: { path, params: { id } } }) {
  const action = path.match(/\/(new|edit|repeat)$/)[1];

  return {
    id,
    action,
    memberId: state.session.memberId,
    data: state.bookings.formData,
    bookingsValidationEnabled: state.session.bookingsValidationEnabled,
    validatedReferences: state.bookings.validatedReferences
  };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(BookingEditor);
