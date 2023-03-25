import { getInfoFormState } from './info-form';
import { useMappedState } from 'typeless';

export function useInitiativeType() {
  return useMappedState([getInfoFormState], state =>
    state.values.type ? (state.values.type.value as number) : 0
  );
}
