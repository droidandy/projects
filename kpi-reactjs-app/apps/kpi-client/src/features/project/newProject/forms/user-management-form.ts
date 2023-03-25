import { createForm } from 'typeless-form';
import { UserManagementFormSymbol } from '../symbol';

export interface UserManagementFormValues {
  owner: string;
  manager: string;
  members: {
    id: number;
    username: string;
    orgUserId: number;
    role: string;
    roleId: number;
  }[];
}

export const [
  useUserManagementForm,
  UserManagementFormActions,
  getUserManagementFormState,
  UserManagementFormProvider,
] = createForm<UserManagementFormValues>({
  symbol: UserManagementFormSymbol,
  validator: (errors, values) => {},
});
