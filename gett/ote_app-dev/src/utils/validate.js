import validate from 'validate.js';
import moment from 'moment';
import { strings } from 'locales';
import PhoneNumber from 'react-native-phone-input/lib/phoneNumber';

validate.validators.expired = ({ year, month } = {}) => {
  const creditCardDate = moment(`${year}${month}`, 'YYYYMM');
  return creditCardDate.isValid() && (moment() > creditCardDate.add(1, 'months')) ? 'is expired' : null;
};

validate.validators.minLengthWithAllowEmpty = (value, minlength) => {
  if (!value) return null;
  if (value.length < minlength) return strings('fieldValidation.phone.length');
  return null;
};

validate.validators.expirationYear = (year) => {
  if (year && year.toString().length !== 4) return strings('fieldValidation.expirationYear.length');
  return null;
};

validate.validators.phone = (number) => {
  if (!number) return null;

  const countryCode = PhoneNumber.getCountryCodeOfNumber(number);
  return PhoneNumber.isValidNumber(number, countryCode) ? null : strings('fieldValidation.phone.invalid');
};

export default validate;
