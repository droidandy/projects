import { createForm } from 'typeless-form';
import {
  validateLangString,
  validateOption,
  validateNumber,
  isKPIScoring4Colors,
  validateString,
  validateMax,
  validateMin,
} from 'src/common/helper';
import { SelectOption } from 'src/types';
import {
  BalancedScorecardItemType,
  KPIScoringType,
  KPICalendarPeriod,
  PeriodFrequency,
  KpiValueType,
} from 'src/types-next';
import i18n from 'src/i18n';
import { getLinkedKpiProp } from './utils';
import { ResourceFormSymbol } from './symbol';
import { getResourceState } from './interface';

export interface ResourceFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  unit: SelectOption;
  scorecard: SelectOption;
  focalPoints: SelectOption[];
  updaters: number[];

  // kpi
  kpiCode: string;
  level: SelectOption;
  scoringType: SelectOption;
  dataType: SelectOption;
  frequency: SelectOption<PeriodFrequency>;
  aggregation: SelectOption;
  actualValue: SelectOption;
  goal: SelectOption;
  low: number;
  high: number;
  yellow: number;
  target: number;
  best: number;
  greenInsideBoundaries: boolean;
  periods: KPICalendarPeriod[];
  linkedKpis: number[];
  isSeriesAggregated: boolean;
  maxLimit: number;

  // extra
  parent: SelectOption;

  [x: string]: any;
}

export const [
  useResourceForm,
  ResourceFormActions,
  getResourceFormState,
  ResourceFormProvider,
] = createForm<ResourceFormValues>({
  symbol: ResourceFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateLangString(errors, values, 'description');
    validateOption(errors, values, 'unit');
    const { name } = getResourceState();

    if (name === 'dataSource') {
      validateOption(errors, values, 'scorecard');
    }

    if (values.type && values.type.value === BalancedScorecardItemType.KPI) {
      const actualValue = values.actualValue
        ? (values.actualValue.value as KpiValueType)
        : null;

      validateString(errors, values, 'kpiCode');
      validateOption(errors, values, 'level');
      validateOption(errors, values, 'scoringType');
      validateOption(errors, values, 'dataType');
      validateOption(errors, values, 'frequency');
      validateOption(errors, values, 'aggregation');
      validateOption(errors, values, 'actualValue');
      validateOption(errors, values, 'goal');
      validateNumber(errors, values, 'maxLimit', true);
      validateMax(errors, values, 'maxLimit', 100);
      validateMin(errors, values, 'maxLimit', 0);

      const scoringType = values.scoringType ? values.scoringType.value : 0;
      if (isKPIScoring4Colors(scoringType)) {
        validateNumber(errors, values, 'yellow');
        validateNumber(errors, values, 'target');
        validateNumber(errors, values, 'best');
      }
      if (KPIScoringType.Bounded === scoringType) {
        validateNumber(errors, values, 'low');
        validateNumber(errors, values, 'high');
      }
      if (actualValue === 'Index') {
        const linkedKpis = values.linkedKpis || [];
        if (!linkedKpis.length) {
          errors.linkedKpis = i18n.t('Select at least 1 KPI');
        } else {
          const total = linkedKpis.reduce(
            (sum, id) => sum + Number(values[getLinkedKpiProp(id, 'weight')]),
            0
          );
          if (total !== 100) {
            errors.linkedKpis = i18n.t('Total weight must be 100');
          }
        }
      }
    }
  },
});
