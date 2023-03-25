// @flow
import validate from 'validate.js';
import { password, confirmPassword } from 'context/validations';

type CompleteAccountFormFields = {
  password?: string,
  confirmPassword?: string,
  termOfUse?: boolean,
};

type CompleteAccountFormErrors = {
  password?: string,
  confirmPassword?: string,
  termOfUse?: string,
};

const validateCompleteAccountForm = (values: CompleteAccountFormFields): CompleteAccountFormErrors => {
  const { termOfUse } = values;

  const constrains = {
    password,
    confirmPassword,
  };

  return {
    ...validate(values, constrains, { fullMessages: false }),
    termOfUse: (termOfUse => (!termOfUse ? 'You should agree with the terms of use' : undefined))(termOfUse),
  };
};

export default validateCompleteAccountForm;
