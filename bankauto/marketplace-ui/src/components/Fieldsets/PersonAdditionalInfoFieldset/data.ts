import { AdditionalDocumentType } from 'constants/credit';

export const MAX_NUMBER_OF_DEPENDANTS = 9;

export const DEPENDANTS_RESTRICTION_TEXT =
  'Лица, находящиеся на длительном или постоянном материальном обеспечении (дети, супруг(а), родители)';

export const EDUCATION_TYPES = [
  { label: 'Неполное среднее', value: '1' },
  { label: 'Среднее', value: '2' },
  { label: 'Среднее-специальное', value: '3' },
  { label: 'Незаконченное высшее', value: '4' },
  { label: 'Высшее', value: '5' },
  { label: 'Учёная степень / MBA', value: '6' },
  { label: 'Два и более высших', value: '7' },
];

export const SHORT_EDUCATION_TYPES = [
  { label: 'Среднее / Неполное среднее', value: '1' },
  { label: 'Неполное высшее / Среднее специальное', value: '3' },
  { label: 'Высшее', value: '4' },
  { label: 'Несколько высших / Ученая степень / MBA', value: '6' },
];

export const MARITAL_STATUSES = [
  { label: 'Женат / замужем', value: '1' },
  { label: 'Холост / не замужем', value: '2' },
  { label: 'Вдовец / вдова', value: '3' },
  { label: 'В разводе', value: '4' },
  { label: 'Гражданский брак / сожительство', value: '5' },
];

export const ADDITIONAL_DOCUMENT_TYPE_MASK_MAP: Record<string, { mask: RegExp[]; maskPlaceholder: string }> = {
  [AdditionalDocumentType.DRIVERS_LICENSE]: {
    mask: [/[0-9]/, /[0-9]/, / /, /[0-9А-я]/, /[0-9А-я]/, / /, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
    maskPlaceholder: '__ __ ______',
  },
  [AdditionalDocumentType.INTERNATIONAL_PASSPORT]: {
    mask: [/[0-9]/, /[0-9]/, / /, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
    maskPlaceholder: '__ _______',
  },
  [AdditionalDocumentType.MILITARY_ID]: {
    mask: [/[А-я]/, /[А-я]/, / /, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
    maskPlaceholder: '__ _______',
  },
  [AdditionalDocumentType.SNILS]: {
    mask: [
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /-/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /-/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      / /,
      /[0-9]/,
      /[0-9]/,
    ],
    maskPlaceholder: '___-___-___ __',
  },
};
