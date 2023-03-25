import { connect } from 'react-redux';
import BaseBookingEditor from 'pages/shared/bookings/BookingEditor';
import dispatchers from 'js/redux/admin/bookings.dispatchers';

function mapStateToProps(state, { match: { path, params: { id } } }) {
  const action = path.match(/\/(new|edit|repeat)$/)[1];

  return {
    id,
    action,
    data: state.bookings.formData,
    validatedReferences: state.bookings.validatedReferences
  };
}

function mapDispatchToProps(dispatch, { companyId }) {
  const props = dispatchers(dispatch);

  return {
    ...props,
    getFormData: props.getFormData.bind(null, companyId),
    saveBooking: props.saveBooking.bind(null, companyId),
    getReferences: props.getReferences.bind(null, companyId),
    validateReferences: props.validateReferences.bind(null, companyId),
    getFormDetails: props.getFormDetails.bind(null, companyId)
  };
}

class BookingEditor extends BaseBookingEditor {
  isAdminPage = true
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingEditor);
