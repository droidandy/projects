import { createForm } from 'typeless-form';
import { StrategicMapFormSymbol } from './symbol';
import { validateLangString } from 'src/common/helper';

export interface StrategicMapFormValues {
  title_en: string;
  title_ar: string;
}

export const [
  useStrategicMapForm,
  StrategicMapFormActions,
  getStrategicMapFormState,
  StrategicMapFormProvider,
] = createForm<StrategicMapFormValues>({
  symbol: StrategicMapFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'title');
  },
});
