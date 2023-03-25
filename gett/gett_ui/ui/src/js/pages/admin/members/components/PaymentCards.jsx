import { connect } from 'react-redux';
import dispatchers from 'js/redux/admin/members.dispatchers';
import PaymentCards from 'pages/shared/passengers/components/PaymentCards';

function mapStateToProps(state) {
  const { paymentCards, loading } = state.members.formData;

  return { paymentCards, loading };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(PaymentCards);
