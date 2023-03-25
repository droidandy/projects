import { useMappedState } from 'typeless';
import { KpiValueType, AggregationType } from 'src/types-next';
import { getResourceFormState } from './resource-form';

export function useScoringType() {
  return useMappedState([getResourceFormState], state =>
    state.values.scoringType ? (state.values.scoringType.value as number) : 0
  );
}

export function useActualValue() {
  return useMappedState([getResourceFormState], state =>
    state.values.actualValue
      ? (state.values.actualValue.value as KpiValueType)
      : null
  );
}

export function useAggregationValue() {
  return useMappedState([getResourceFormState], state =>
    state.values.aggregation
      ? (state.values.aggregation.value as AggregationType)
      : null
  );
}
