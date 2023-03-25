import { SelectOption, ExcellenceRequirementStatus } from 'src/types';
import { createForm } from 'typeless-form';
import { validateLangString, validateOption } from 'src/common/utils';
import { ExcellenceFormSymbol } from './symbol';

export interface ExcellenceFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  isCompleted: SelectOption<boolean>;
  isActive: SelectOption<boolean>;
  requirementStatus: SelectOption<ExcellenceRequirementStatus>;
  responsibleUnit: SelectOption;
  ownerUnit: SelectOption;
  startDate: string;
  endDate: string;
  criteria: SelectOption;
  theme: SelectOption;
}

export const [
  useExcellenceForm,
  ExcellenceFormActions,
  getExcellenceFormState,
  ExcellenceFormProvider,
] = createForm<ExcellenceFormValues>({
  symbol: ExcellenceFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateLangString(errors, values, 'description');
    validateOption(errors, values, 'isCompleted');
    validateOption(errors, values, 'isActive');
    validateOption(errors, values, 'requirementStatus');
    validateOption(errors, values, 'criteria');
    validateOption(errors, values, 'theme');
    validateOption(errors, values, 'responsibleUnit');
    validateOption(errors, values, 'ownerUnit');

    if (!errors.isActive && !errors.requirementStatus) {
      if (values.isActive.value && values.requirementStatus.value !== 'Exist') {
        errors.isActive = 'You cannot set Active if Exist is not true';
      }
    }

    if (!errors.isCompleted && !errors.isActive) {
      if (values.isCompleted.value && !values.isActive.value) {
        errors.isCompleted = 'You cannot set completed if Active not true';
      }
    }
  },
});
