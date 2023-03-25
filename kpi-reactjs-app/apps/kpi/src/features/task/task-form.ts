import { createForm } from 'typeless-form';
import { TaskFormSymbol } from './symbol';
import { validateDate, validateString } from 'src/common/helper';
import { getTaskState } from './interface';

export interface TaskFormValues {
  startDate: string;
  endDate: string;
  comment: string;
}

export const [
  useTaskForm,
  TaskFormActions,
  getTaskFormState,
  TaskFormProvider,
] = createForm<TaskFormValues>({
  symbol: TaskFormSymbol,
  validator: (errors, values) => {
    if (getTaskState().saveType === 'save') {
      validateDate(errors, values, 'startDate');
      validateDate(errors, values, 'endDate');
      if (!errors.startDate && !errors.endDate) {
        const startDate = new Date(values.startDate);
        const endDate = new Date(values.endDate);
        if (endDate.getTime() < startDate.getTime()) {
          errors.endDate = 'End Date should not be less than Start Date.';
        }
        const now = new Date();
        if (
          startDate.getTime() <
          new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
        ) {
          errors.startDate = 'Start Date should not be in the past.';
        }
      }
    } else {
      validateString(errors, values, 'comment');
    }
  },
});
