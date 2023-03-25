import { connect } from 'react-redux';
import dispatchers from 'js/redux/app/passengers.dispatchers';
import PaymentCards from 'pages/shared/passengers/components/PaymentCards';

function mapStateToProps(state) {
  const { paymentCards, loading } = state.passengers.formData;

  return { paymentCards, loading };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(PaymentCards);
