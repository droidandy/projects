import { createForm } from 'typeless-form';
import { ResourcesFormSymbol } from '../symbol';
import { SelectOption } from 'src/types';

export interface BudgetPlan {
  id: number;
  activity: SelectOption | undefined;
  details: string;
  financialItem: string;
  mainBudget: string;
  extraCost: string;
  totalCost: string;
  paymentProc: SelectOption | undefined;
  timeline: Date[];
  comment: string;
}

export interface OtherResource {
  id: number;
  activity: SelectOption | undefined;
  resource: SelectOption | undefined;
  details: string;
  mainBudget: string;
  comment: string;
}

export interface ProjectResourcesFormValues {
  budgetPlans: BudgetPlan[];
  otherResources: OtherResource[];
}

export const [
  useResourcesForm,
  ResourcesFormActions,
  getResourcesFormState,
  ResourcesFormProvider,
] = createForm<ProjectResourcesFormValues>({
  symbol: ResourcesFormSymbol,
  validator: (errors, values) => {
    values.budgetPlans.forEach(value => {
      if (!value.activity) {
        (errors as any)['activity_' + value.id] =
          'Please select phase/activity.';
      }

      if (!value.details) {
        (errors as any)['details_' + value.id] = 'Please input details.';
      }
    });
    values.otherResources.forEach(value => {
      if (!value.activity) {
        (errors as any)['otherActivity_' + value.id] =
          'Please select phase/activity.';
      }
    });
  },
});
