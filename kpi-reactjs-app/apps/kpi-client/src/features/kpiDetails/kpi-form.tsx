import { createForm } from 'typeless-form';
import { KpiFormSymbol } from './symbol';
import { validateKpiForm, KpiFormValues } from 'src/common/kpi';

export const [
  useKpiForm,
  KpiFormActions,
  getKpiFormState,
  KpiFormProvider,
] = createForm<KpiFormValues>({
  symbol: KpiFormSymbol,
  validator: (errors, values) => {
    validateKpiForm(errors, values);
  },
});
