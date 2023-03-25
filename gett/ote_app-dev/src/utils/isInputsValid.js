import validate from './validate';
/* eslint-disable import/prefer-default-export */
export const isInputsValid = (keys, data, validationRules, fn) => {
  if (keys) {
    let results = null;

    (keys).forEach((key) => {
      if (key in validationRules) {
        const result = validate(data, { [key]: validationRules[key] });

        if (result) results = { ...results, ...result };
      }
    });
    if (results) fn(results);

    return !results;
  }

  return true;
};
