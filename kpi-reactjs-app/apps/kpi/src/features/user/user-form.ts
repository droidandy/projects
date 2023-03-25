import { createForm } from 'typeless-form';
import { UserFormSymbol } from './symbol';
import {
  validateString,
  validateEmail,
  validateLangString,
} from 'src/common/helper';
import { getUserState } from './interface';

export interface UserFormValues {
  name_en: string;
  name_ar: string;
  username: string;
  password?: string;
  newPassword?: string;
  email: string;
}

export const [
  useUserForm,
  UserFormActions,
  getUserFormState,
  UserFormProvider,
] = createForm<UserFormValues>({
  symbol: UserFormSymbol,
  validator: (errors, values) => {
    const { user } = getUserState();
    validateLangString(errors, values, 'name');
    validateString(errors, values, 'username');
    validateString(errors, values, 'email');
    validateEmail(errors, values, 'email');
    if (!user) {
      validateString(errors, values, 'password');
    }
  },
});
