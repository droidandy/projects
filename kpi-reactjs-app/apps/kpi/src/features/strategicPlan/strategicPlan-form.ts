import { createForm } from 'typeless-form';
import { StrategicPlanFormSymbol } from './symbol';
import { validateString, validateNumber } from 'src/common/helper';

export interface StrategicPlanFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  vision_en: string;
  vision_ar: string;
  mission_en: string;
  mission_ar: string;
  strengths_en: string;
  strengths_ar: string;
  weaknesses_en: string;
  weaknesses_ar: string;
  opportunities_en: string;
  opportunities_ar: string;
  threats_en: string;
  threats_ar: string;
  startYear: number;
  endYear: number;
}

export const [
  useStrategicPlanForm,
  StrategicPlanFormActions,
  getStrategicPlanFormState,
  StrategicPlanFormProvider,
] = createForm<StrategicPlanFormValues>({
  symbol: StrategicPlanFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'name_en');
    validateString(errors, values, 'name_ar');
    validateString(errors, values, 'description_en');
    validateString(errors, values, 'description_ar');
    validateString(errors, values, 'vision_en');
    validateString(errors, values, 'vision_ar');
    validateString(errors, values, 'mission_en');
    validateString(errors, values, 'mission_ar');
    validateNumber(errors, values, 'startYear');
    validateNumber(errors, values, 'endYear');
  },
});