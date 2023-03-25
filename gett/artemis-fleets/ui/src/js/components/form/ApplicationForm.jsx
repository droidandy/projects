import BaseForm from 'react-form-base';
import validateJs from 'validate.js';

function validate() {
  const errors = validateJs.single(...arguments);

  return errors && errors[0];
}

function propertyPresenceValidation(value, propName) {
  const obj = value || {};

  if (typeof propName === 'string') {
    return strPropPresence(obj, propName);
  }

  for (const key in propName) {
    const options = propName[key];
    const error = strPropPresence(obj, key, options);

    if (error) return error;
  }

  function strPropPresence(value, propName, options) {
    if (options && options.if && !options.if.call(this)) return null;

    delete options.if;
    return validate(value[propName], { presence: options });
  }
}

export default class ApplicationForm extends BaseForm {
  static validations = {
    presence(value, options) {
      if (typeof options !== 'object') options = {};
      if (value === false) value = undefined;

      if (options.if) {
        if (!options.if.call(this)) return;
        delete options.if;
      }

      return validate(value, { presence: options });
    },
    email(value) {
      const prepared = (value || '').trim();

      if (!prepared) return null;

      return validate(prepared, { email: true });
    },
    strongPassword(value) {
      if (!value) return;

      const isTooShort = value.length < 8;
      const hasNoUppercase = !/[A-Z]/.test(value);
      const hasNoSymbol = !/\W/.test(value);
      const isWeak = isTooShort || hasNoUppercase || hasNoSymbol;

      if (isWeak) {
        return 'Password doesn\'t match one of the criteria';
      }
    },
    equality(value, options) {
      if (!value) return;
      if (value !== this.get(options.to)) {
        return `is not equal to ${options.to}`;
      }
    },
    propertyPresence: propertyPresenceValidation,
    address(value) {
      return propertyPresenceValidation(value, {
        line: true,
        lat: { message: 'invalid address' }
      });
    },
    numericality(value) {
      if (!value || !value.toString().trim().length) return;

      return validate(value, { numericality: true });
    }
  };

  getError(name) {
    const error = super.getError(name);

    return Array.isArray(error) ? error[0] : error;
  }

  updateErrors(errors) {
    return this.setState({ errors: { ...this.getErrors(), ...errors } });
  }
}
