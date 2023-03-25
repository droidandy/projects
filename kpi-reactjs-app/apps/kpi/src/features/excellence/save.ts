import {
  getExcellenceDetailsState,
  getExcellenceFormState,
} from './components/ExcellenceModal';
import {
  createExcellenceRequirement,
  updateExcellenceRequirement,
} from 'src/services/API-next';

export function saveExcellence(draft: boolean) {
  const { excellence } = getExcellenceDetailsState();
  const { values: formValues } = getExcellenceFormState();

  const basicInfo = {
    name: {
      en: formValues.name_en,
      ar: formValues.name_ar,
    },
    description: {
      en: formValues.description_en,
      ar: formValues.description_ar,
    },
    status: draft ? 'Draft' : 'Active',
    isCompleted: formValues.isCompleted.value,
    requirementStatus: formValues.requirementStatus.value,
    startDate: formValues.startDate,
    endDate: formValues.endDate,
    responsibleUnitId: formValues.responsibleUnit.value,
    ownerUnitId: formValues.ownerUnit.value,
    isEnabled: formValues.isActive.value,
    excellenceCriteriaId: formValues.criteria.value,
    excellenceThemeId: formValues.theme.value,
  } as const;

  if (!excellence) {
    return createExcellenceRequirement(basicInfo);
  } else {
    return updateExcellenceRequirement(excellence.id, basicInfo);
  }
}
