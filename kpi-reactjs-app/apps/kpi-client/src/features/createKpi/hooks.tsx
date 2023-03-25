import { useMappedState } from 'typeless';
import { KpiValueType, AggregationType } from 'src/types';
import { getKpiFormState } from './kpi-form';

export function useScoringType() {
  return useMappedState([getKpiFormState], state =>
    state.values.scoringType ? (state.values.scoringType.value as number) : 0
  );
}

export function useDataType() {
  return useMappedState([getKpiFormState], state =>
    state.values.dataType ? (state.values.dataType.value as number) : 0
  );
}

export function useActualValue() {
  return useMappedState([getKpiFormState], state =>
    state.values.actualValue
      ? (state.values.actualValue.value as KpiValueType)
      : null
  );
}

export function useAggregationValue() {
  return useMappedState([getKpiFormState], state =>
    state.values.aggregation
      ? (state.values.aggregation.value as AggregationType)
      : null
  );
}
