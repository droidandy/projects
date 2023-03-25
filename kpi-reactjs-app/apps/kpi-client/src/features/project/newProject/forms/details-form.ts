import { createForm } from 'typeless-form';
import { DetailsFormSymbol } from '../symbol';
import { SelectOption } from 'src/types';

export interface ProjectDetailsFormValues {
  name: string;
  description: string;
  budget: string;
  startDate: Date;
  endDate: Date;
  objectives: string[];
  state: string;
  specs: string[];
  challenges: string[];
  relProjects: SelectOption[];
}

export const [
  useDetailsForm,
  DetailsFormActions,
  getDetailsFormState,
  DetailsFormProvider,
] = createForm<ProjectDetailsFormValues>({
  symbol: DetailsFormSymbol,
  validator: (errors, values) => {
    errors.name = '';
    if (!values.name) {
      errors.name = 'Please enter Project name.';
    }

    errors.description = '';
    if (!values.description || values.description === '<p><br></p>') {
      errors.description = 'Please enter Project description.';
    }

    errors.budget = '';
    if (!values.budget) {
      errors.budget = 'Please enter Project budget.';
    }

    errors.startDate = '';
    if (!values.startDate) {
      errors.startDate = 'Please enter Project start date.';
    }

    errors.endDate = '';
    if (!values.endDate) {
      errors.endDate = 'Please enter Project end date.';
    }

    values.objectives.forEach((value, index) => {
      if (!value) {
        (errors as any)['objectives_' + index] =
          'Please enter Project Objectives';
      }
    });
  },
});
