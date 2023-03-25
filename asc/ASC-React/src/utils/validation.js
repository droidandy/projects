import isEmail from 'validator/lib/isEmail';

const isEmpty = (value) => {
  return value === undefined || value === null || value === '';
};

const join = rules => (value, data) =>
  rules.map((rule) => rule(value, data)).filter((error) => !!error)[0];

export const email = (value) => {
  return !isEmpty(value) && !isEmail(value) && 'Invalid email address';
};

export const required = value => isEmpty(value) && 'Required field';

export const minLength = min => (value) => {
  return !isEmpty(value) && value.length < min &&
    `Must be at least ${min} characters`;
};

export const maxLength = max => (value) => {
  return !isEmpty(value) && value.length > max &&
    `Must be no more than ${max} characters`;
};

export const match = field => (value, data) => {
  return data && value !== data[field] && 'Must match';
};

export const createValidator = (rules) => (data = {}) => {
  const errors = {};
  Object.keys(rules).forEach((key) => {
    const rule = join([].concat(rules[key]));
    const error = rule(data[key], data);
    if (error) {
      errors[key] = error;
    }
  });
  return errors;
};
