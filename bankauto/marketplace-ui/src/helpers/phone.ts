import { ChangeEvent } from 'react';

const CODE_FORMAT = '+7';

function withoutCode(phone: string): string {
  return phone.replace(CODE_FORMAT, '');
}

const eliminateLeadingCountryCode =
  (callback: (e: ChangeEvent<HTMLInputElement>) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    while (e.target.value && ['+', '7', '8'].includes(e.target.value[0])) e.target.value = e.target.value.substring(1);
    callback(e);
  };

const formatPhone = (phone: string) =>
  `${phone.slice(0, 2)} (${phone.slice(2, 5)}) ${phone.slice(5, 8)}-${phone.slice(8, 10)}-${phone.slice(10)}`;

export { withoutCode, eliminateLeadingCountryCode, formatPhone };
