import { createForm } from 'typeless-form';
import { ReportingCycleFormSymbol } from './symbol';
import { validateString, validateDate } from 'src/common/helper';
import { getReportingCycleState } from './interface';

export interface ReportingCycleFormValues {
  date: string;
  notes: string;
}

export const [
  useReportingCycleForm,
  ReportingCycleFormActions,
  getReportingCycleFormState,
  ReportingCycleFormProvider,
] = createForm<ReportingCycleFormValues>({
  symbol: ReportingCycleFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'notes');
    const { saveType } = getReportingCycleState();
    if (saveType === 'hold') {
      validateDate(errors, values, 'date');
    }
  },
});
