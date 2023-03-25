import { ChangeEvent } from 'react';

const format = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const capitalizeInputValue =
  (callback: (e: ChangeEvent<HTMLInputElement>) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value) {
      e.target.value = format(value);
    }
    callback(e);
  };

const capitalizeInputValueWC = (value: string) => {
  if (value) {
    value = format(value);
  }

  return value;
};

export { capitalizeInputValue, capitalizeInputValueWC };
