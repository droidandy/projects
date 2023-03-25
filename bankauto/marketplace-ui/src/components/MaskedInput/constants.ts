export enum MaskCharacter {
  Digits = '9',
  LatinUpperCase = 'Z',
  LatinLowerCase = 'z',
  CyrillicUpperCase = 'Я',
  CyrillicLowerCase = 'я',
}

const OPENING_GROUP_CHAR = '[';
const CLOSING_GROUP_CHAR = ']';
const DEFAULT_MASK_SYMBOL = '_';
const AVAILABLE_SYMBOL_REGEXP = /\d|[A-z]|[А-я]/g;
const MASK_REPLACE_REGEXP = /9|Я|я|Z|z/g;
const MASK_REGEXP_MAP = {
  [MaskCharacter.Digits]: /\d/g,
  [MaskCharacter.LatinUpperCase]: /[A-Z]/g,
  [MaskCharacter.LatinLowerCase]: /[a-z]/g,
  [MaskCharacter.CyrillicUpperCase]: /[А-Я]/g,
  [MaskCharacter.CyrillicLowerCase]: /[а-я]/g,
};

export {
  OPENING_GROUP_CHAR,
  CLOSING_GROUP_CHAR,
  DEFAULT_MASK_SYMBOL,
  AVAILABLE_SYMBOL_REGEXP,
  MASK_REPLACE_REGEXP,
  MASK_REGEXP_MAP,
};
