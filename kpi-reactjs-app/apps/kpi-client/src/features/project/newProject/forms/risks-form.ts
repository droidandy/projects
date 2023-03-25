import { createForm } from 'typeless-form';
import { RisksFormSymbol } from '../symbol';
import { SelectOption } from 'src/types';

export interface RiskManagement {
  id: number;
  activity: SelectOption | undefined;
  type: SelectOption | undefined;
  description: string;
  probability: SelectOption;
  impact: SelectOption;
  counterMeasures: SelectOption[];
  responsibility: SelectOption | undefined;
  timeline: Date[];
}
export interface ProjectRisksFormValues {
  risks: RiskManagement[];
}

export const [
  useRisksForm,
  RisksFormActions,
  getRisksFormState,
  RisksFormProvider,
] = createForm<ProjectRisksFormValues>({
  symbol: RisksFormSymbol,
  validator: (errors, values) => {
    values.risks.forEach(value => {
      if (!value.activity) {
        (errors as any)['activity_' + value.id] =
          'Please select phase/activity.';
      }
    });
  },
});
