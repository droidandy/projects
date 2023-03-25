import { reduxForm } from 'redux-form';

import SubscriptionForm from 'components/subscription/Subscription/SubscriptionForm';
import validate from 'components/subscription/Subscription/SubscriptionForm/validate';

const form = 'subscriptionForm';

export default reduxForm({
  form,
  validate,
})(SubscriptionForm);
