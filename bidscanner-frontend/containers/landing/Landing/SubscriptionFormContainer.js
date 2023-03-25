import { reduxForm } from 'redux-form';

import SubscriptionForm from 'components/landing/Landing/SubscriptionForm';
import validate from 'components/landing/Landing/SubscriptionForm/validate';

const form = 'subscriptionForm';

export default reduxForm({
  form,
  validate,
})(SubscriptionForm);
