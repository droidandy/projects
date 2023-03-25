import { createForm } from 'typeless-form';
import { ChallengeTaskFormSymbol } from './symbol';
import { SelectOption } from 'src/types';
import { validateOption } from 'src/common/helper';
import { getChallengeTaskState } from './interface';

export interface ChallengeTaskFormValues {
  [x: string]: any;

  isAccepted: SelectOption<boolean>;
  acceptedComment: string;
}

export function getAnswer(id: number, values: ChallengeTaskFormValues) {
  return values[`answer_${id}`] as SelectOption<boolean>;
}

export const [
  useChallengeTaskForm,
  ChallengeTaskFormActions,
  getChallengeTaskFormState,
  ChallengeTaskFormProvider,
] = createForm<ChallengeTaskFormValues>({
  symbol: ChallengeTaskFormSymbol,
  validator: (errors, values) => {
    validateOption(errors, values, 'isAccepted');
    getChallengeTaskState().actions.forEach(action => {
      validateOption(errors, values, `answer_${action.id}`);
    });
  },
});
