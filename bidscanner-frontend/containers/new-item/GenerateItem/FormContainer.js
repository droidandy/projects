import { reduxForm } from 'redux-form';

import Form from 'components/new-item/GenerateItem/Form';
import validate from 'components/new-item/GenerateItem/validate';

export default reduxForm({
  form: 'generateItemForm',
  initialValues: {
    description: '',
    files: [],
    subcategories: [],
    price: {
      value: '',
      currency: 'USD',
      quantityType: 'pcs',
    },
    inStock: {
      value: '',
      quantityType: 'pcs',
    },
  },
  validate,
})(Form);
