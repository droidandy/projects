/**
 * @param scope - the component wishing to set state. note: possibly use bind patterns here so scope doens't have to be passed;
 * @param {array} validators - an array of validator objects
* */
export function isFormValid(scope, validators) {
  const allFieldsValid = [];
  const errObj = {};
  if (validators && Array.isArray(validators)) {
    validators.forEach((item) => {
      if (item && item.name && typeof item.isValid === 'function') {
        const isValid = item.isValid();
        allFieldsValid.push(isValid);
        errObj[item.name] = !isValid;
      }
    });
  } else {
    throw new Error('please pass a valid array of validator objects');
  }

  scope.setState({ formErrors: errObj });
  return !(allFieldsValid.includes(false));
}

export function extractFloat(string) {
  const regex = /[+-]?\d+(\.\d+)?/g;
  const value = string !== null && string !== undefined ? string.toString() : '';
  const matched = value.match(regex);

  if (!matched) return [null];

  return matched.map((v) => parseFloat(v));
}
