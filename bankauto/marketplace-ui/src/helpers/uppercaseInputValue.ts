import { ChangeEvent } from 'react';

const format = (value: string) => {
  return value.toUpperCase();
};

const uppercaseInputValue =
  (callback: (e: ChangeEvent<HTMLInputElement>) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value) {
      e.target.value = format(value);
    }
    callback(e);
  };

const uppercaseInputValueWC = (value: string) => {
  if (value) {
    value = format(value);
  }

  return value;
};

export { uppercaseInputValue, uppercaseInputValueWC };
