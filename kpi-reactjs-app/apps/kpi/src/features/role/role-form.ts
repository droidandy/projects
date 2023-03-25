import { createForm } from 'typeless-form';
import { RoleFormSymbol } from './symbol';
import {
  validateString,
  validateMap,
  validateLangString,
} from 'src/common/helper';
import { PermissionMap } from 'src/types-next';

export interface RoleFormValues {
  name_en: string;
  name_ar: string;
  description: string;
  slug: string;
  permissionMap: PermissionMap;
}

export const [
  useRoleForm,
  RoleFormActions,
  getRoleFormState,
  RoleFormProvider,
] = createForm<RoleFormValues>({
  symbol: RoleFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateString(errors, values, 'slug');
    validateString(errors, values, 'description');
    validateMap(errors, values, 'permissionMap');
  },
});
