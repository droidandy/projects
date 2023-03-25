import { createForm } from 'typeless-form';
import { SubmitTaskFormSymbol } from './symbol';
import { validateNumber } from 'src/common/helper';

export interface SubmitTaskFormValues {
  value: string;
}

export const [
  useSubmitTaskForm,
  SubmitTaskFormActions,
  getSubmitTaskFormState,
  SubmitTaskFormProvider,
] = createForm<SubmitTaskFormValues>({
  symbol: SubmitTaskFormSymbol,
  validator: (errors, values) => {
    validateNumber(errors, values, 'value');
  },
});
