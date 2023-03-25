import BaseForm from 'react-form-base';
import validateJs from 'validate.js';
import moment from 'moment';
import { getCountryByPhoneNumber } from 'utils';

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

      return validate(value, { presence: { allowEmpty: false, ...options } });
    },
    email(value, options = true) {
      const prepared = (value || '').trim();

      if (!prepared) return null;

      const res = validateJs.single(prepared, {email: options});

      if (res != undefined) {
        return 'Email is not valid';
      }
    },
    strongPassword(value) {
      if (!value) return;

      const isTooShort = value.length < 8;
      const hasNoUppercase = !/[A-Z]/.test(value);
      const hasNoSymbol = !/\W|_/.test(value);
      const isWeak = isTooShort || hasNoUppercase || hasNoSymbol;

      if (isWeak) {
        return 'Password does not meet requirements';
      }
    },
    equality(value, options) {
      if (!value) return;
      if (value !== this.get(options.to)) {
        return options.message || `is not equal to ${options.to.replace(/^.+\.(?!\.)/, '')}`;
      }
    },
    propertyPresence: propertyPresenceValidation,
    address(value) {
      if (!value || value.id) return;

      return propertyPresenceValidation(value, {
        line: true,
        lat: { message: 'Address not found. Please check the address entered.' },
        countryCode: { message: 'Sorry, this address is not supported by our system' }
      });
    },
    numericality(value, options = true) {
      if (!value || !value.toString().trim().length) return;

      return validate(value, { numericality: options });
    },
    longitude(value) {
      if (!value || !value.toString().trim().length) return;
      if (validate(value, { numericality: { greaterThanOrEqualTo: -90, lessThanOrEqualTo: 90 } })) {
        return 'Longitude should be from -90 to 90';
      }
    },
    latitude(value) {
      if (!value || !value.toString().trim().length) return;
      if (validate(value, { numericality: { greaterThanOrEqualTo: -180, lessThanOrEqualTo: 180 } })) {
        return 'Latitude should be from -180 to 180';
      }
    },
    length(value, options) {
      return validate(value, { length: options });
    },
    isInFuture(value) {
      if (!value) return;
      if (value.isBefore(moment())) return 'booking time should be in future';
    },
    phoneNumber(value) {
      if (!value) return;

      const sanitizedValue = value.replace(/\D/g, '');
      const country = getCountryByPhoneNumber(value);

      if (country && sanitizedValue.startsWith(`${country.dialCode}0`)) {
        return 'Invalid phone format. Please remove 0 after country dial code';
      }
      if (sanitizedValue.startsWith('0')) {
        return 'Invalid phone format. Phone should start with country dial code';
      }
      if (sanitizedValue.length < 10) return 'Invalid phone format';
    },
    personName(value, options) {
      if (!value) return;

      return validate(value, {
        length: { maximum: options && options.length || 60 },
        format: { pattern: /^[^/|{}[\]%^]+$/, message: 'Invalid name. Avoid using special symbols' }
      });
    },
    cvv(value) {
      if (!value) return;

      return validate(value, {
        format: { pattern: /^\d{3,4}$/, message: 'cvv must contains 3 or 4 digits' }
      });
    },

    cardExpiration(monthOrYearValue, options) {
      if (!monthOrYearValue) return;

      let expirationMonth, expirationYear;
      if ('yearInputName' in options) {
        expirationMonth = parseInt(monthOrYearValue);
        expirationYear = this.get(options.yearInputName);
      } else if ('monthInputName' in options) {
        expirationYear = parseInt(monthOrYearValue);
        expirationMonth = this.get(options.monthInputName);
      }

      if (!(expirationMonth && expirationYear)) {
        return;
      }
      const expiration = moment({ year: expirationYear, month: expirationMonth - 1 });
      if (expiration < moment()) {
        return 'card is expired';
      }
    }
  };

  get isNew() {
    return !this.get('id');
  }

  getError(name) {
    const error = super.getError(name);

    return Array.isArray(error) ? error[0] : error;
  }

  updateErrors(errors) {
    return this.setState({ errors: { ...this.getErrors(), ...errors } });
  }
}
