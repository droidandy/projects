import { reduxForm } from 'redux-form';

import Form from 'components/transaction/Transaction/Form';

const form = 'transaction';

export default reduxForm({
  form,
  initialValues: {
    price: {
      value: '',
      currency: 'USD',
    },
    deliveryAddress: {
      value: '',
    },
  },
})(Form);
