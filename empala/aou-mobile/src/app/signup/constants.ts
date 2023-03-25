import { ChecklistItem } from '~/components/molecules/validationBadges/types';

export const PASSWORD_CHECKLIST = [
  new ChecklistItem('lowercase letter', /[a-z]/),
  new ChecklistItem('capital letter', /[A-Z]/),
  new ChecklistItem('number', /[0-9]/),
  new ChecklistItem('min. 8 characters', /.{8,}/),
  new ChecklistItem('special character', /\W{1}/),
];

export const MOCKED_PHONE_NUMBER = '+199999999';
