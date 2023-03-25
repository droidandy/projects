import { useMemo, useState } from 'react';
import * as yup from 'yup';

import { PASSWORD_CHECKLIST } from '~/app/signup/constants';
import { ChecklistItem } from '~/components/molecules/validationBadges/types';

const validatePassword = (value: string | undefined) => PASSWORD_CHECKLIST.map((checklistItem) => ({
  ...checklistItem,
  ok: Boolean(value && checklistItem.pattern.test(value)),
}));

export const usePasswordValidation = (): {
  passwordValidationData: ChecklistItem[],
  passwordValidationSchema: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>
} => {
  const [passwordValidationData, setPasswordValidationData] = useState<ChecklistItem[]>(validatePassword(''));

  const passwordValidationSchema = useMemo(() => {
    const isValidPassword = (password: string | undefined) => {
      const validationResult = validatePassword(password);
      setPasswordValidationData(validationResult);
      return validationResult.every((item) => item.ok);
    };

    const schema = yup.string().test('passwordValidation', 'Invalid password', isValidPassword);

    return schema;
  }, [setPasswordValidationData]);

  return { passwordValidationData, passwordValidationSchema };
};
