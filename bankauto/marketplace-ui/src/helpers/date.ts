import { isValid } from './validations/date';

function convertToDBFormat(date: string): string | null {
  if (!isValid(date) || !date.includes('.')) {
    return null;
  }

  return date.split('.').reverse().join('-');
}

export { convertToDBFormat };
