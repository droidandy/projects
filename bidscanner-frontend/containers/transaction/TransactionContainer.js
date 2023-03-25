import { reduxForm } from 'redux-form';

import Transaction from 'components/transaction/Transaction';

export default reduxForm({
  form: 'transaction',
})(Transaction);
