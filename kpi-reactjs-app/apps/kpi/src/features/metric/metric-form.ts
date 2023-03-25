import { createForm } from 'typeless-form';
import { MetricFormSymbol } from './symbol';
import { validateString, validateBool } from 'src/common/helper';

export interface MetricFormValues {
  name_en: string;
  name_ar: string;
  metricType: string;
  dataType: string;
  dataSource: string;
  enabled: { label: any; value: boolean };
}

export const [
  useMetricForm,
  MetricFormActions,
  getMetricFormState,
  MetricFormProvider,
] = createForm<MetricFormValues>({
  symbol: MetricFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'name_en');
    validateString(errors, values, 'name_ar');
    validateString(errors, values, 'metricType');
    validateString(errors, values, 'dataType');
    validateString(errors, values, 'dataSource');
    validateBool(errors, values, 'enabled');
  },
});
