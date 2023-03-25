import { createForm } from 'typeless-form';
import { ChangeManagementFormSymbol } from '../symbol';
import { SelectOption } from 'src/types';

interface ChangeManagementValue {
  id: number;
  needForChange: string;
  description: string;
  changeScope: SelectOption | undefined;
  affectedParties: SelectOption | undefined;
  requiredAction: SelectOption[];
  timeline: Date[];
}

export interface ChangeManagementFormValues {
  changeManagements: ChangeManagementValue[];
}

export const [
  useChangeManagementForm,
  ChangeManagementFormActions,
  getChangeManagementFormState,
  ChangeManagementFormProvider,
] = createForm<ChangeManagementFormValues>({
  symbol: ChangeManagementFormSymbol,
  validator: (errors, values) => {},
});
