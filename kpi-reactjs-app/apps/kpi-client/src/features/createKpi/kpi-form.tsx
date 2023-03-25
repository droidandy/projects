import { createForm } from 'typeless-form';
import { KpiFormSymbol } from './symbol';
import { KpiFormValues, validateKpiForm } from 'src/common/kpi';

export const [
  useKpiForm,
  KpiFormActions,
  getKpiFormState,
  KpiFormProvider,
] = createForm<KpiFormValues>({
  symbol: KpiFormSymbol,
  validator: (errors, values) => {
    validateKpiForm(errors, values, true);
  },
});
