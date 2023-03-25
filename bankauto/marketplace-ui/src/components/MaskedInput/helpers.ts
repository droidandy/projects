import {
  CLOSING_GROUP_CHAR,
  DEFAULT_MASK_SYMBOL,
  MaskCharacter,
  MASK_REGEXP_MAP,
  MASK_REPLACE_REGEXP,
  OPENING_GROUP_CHAR,
} from './constants';
import { MaskChar } from './types';

function convertMaskToArray(mask: string): MaskChar[] {
  if (!mask || typeof mask !== 'string') {
    return [];
  }

  const openings: number[] = [];
  const closings: number[] = [];
  const indexesToDelete: number[] = [];

  return Array.from(mask, (char, index) => {
    if (char === OPENING_GROUP_CHAR) {
      openings.push(index);
    } else if (char === CLOSING_GROUP_CHAR) {
      closings.push(index);
    }

    return char;
  })
    .map((char, index) => {
      const indexesOfValues = [];
      const charIndex = openings.indexOf(index);

      if (charIndex !== -1) {
        for (let i = openings[charIndex]; i <= closings[charIndex]; i++) {
          indexesOfValues.push(i);
          indexesToDelete.push(i);
        }

        return indexesOfValues;
      }

      if (indexesToDelete.includes(index)) {
        return null;
      }

      return char;
    })
    .map((v) => (Array.isArray(v) ? v.slice(1, v.length - 1).map((i) => mask[i]) : v))
    .filter((v) => !!v);
}

function getInputMask(maskChars: MaskChar[]): string {
  if (!maskChars || !Array.isArray(maskChars)) {
    return '';
  }

  return maskChars
    .map((v) => {
      if (Array.isArray(v) || (v && v.match(MASK_REPLACE_REGEXP) !== null)) {
        return DEFAULT_MASK_SYMBOL;
      }

      return v;
    })
    .join('');
}

function isWrongChar(char: string, maskChar: MaskChar): boolean {
  if (!char || (!Array.isArray(maskChar) && !MASK_REGEXP_MAP[maskChar as MaskCharacter])) {
    return true;
  }

  return Array.isArray(maskChar)
    ? maskChar.every((c) => {
        return !MASK_REGEXP_MAP[c as MaskCharacter] ? true : char.match(MASK_REGEXP_MAP[c as MaskCharacter]) === null;
      })
    : char.match(MASK_REGEXP_MAP[maskChar as MaskCharacter]) === null;
}

export { convertMaskToArray, getInputMask, isWrongChar };
