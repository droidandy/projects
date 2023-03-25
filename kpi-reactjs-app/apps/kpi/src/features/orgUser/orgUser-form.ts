import { createForm } from 'typeless-form';
import { OrgUserFormSymbol } from './symbol';
import { validateMap, validateOption } from 'src/common/helper';
import { SelectOption } from 'src/types';

export interface OrgUserFormValues {
  user: SelectOption;
  unit: SelectOption;
  rolesMap: { [x: number]: number };
}

export const [
  useOrgUserForm,
  OrgUserFormActions,
  getOrgUserFormState,
  OrgUserFormProvider,
] = createForm<OrgUserFormValues>({
  symbol: OrgUserFormSymbol,
  validator: (errors, values) => {
    validateOption(errors, values, 'user');
    validateOption(errors, values, 'unit');
    validateMap(errors, values, 'rolesMap');
  },
});
