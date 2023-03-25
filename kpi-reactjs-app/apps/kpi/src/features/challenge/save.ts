import * as R from 'remeda';
import * as Rx from 'src/rx';
import { getChallengeState } from './interface';
import { getChallengeFormState, getActionData } from './challenge-form';
import {
  updateChallenge,
  createChallenge,
  createChallengeAction,
  deleteChallengeAction,
  updateChallengeAction,
} from 'src/services/API-next';
import { BalancedScorecardItemType } from 'src/types-next';
import { getGlobalState } from '../global/interface';

export function saveChallenge(draft: boolean) {
  const { user } = getGlobalState();
  const { challenge } = getChallengeState();
  const { values: formValues } = getChallengeFormState();
  const actionIds = formValues.actions || [];

  const values = {
    name: {
      en: formValues.name_en,
      ar: formValues.name_ar,
    },
    description: {
      en: formValues.description_en,
      ar: formValues.description_ar,
    },
    affectedUnitId: formValues.affectedUnit.value,
    challengedUnitId: formValues.challengedUnit.value,
    itemType: BalancedScorecardItemType[formValues.itemType.value],
    balancedScorecardItemId: formValues.item.value,
    affectedPeriodYear: formValues.period_year,
    affectedPeriodFrequency: formValues.period_frequency,
    affectedPeriodNumer: formValues.period_number,
    status: draft ? 'Draft' : 'Active',
  };
  if (challenge) {
    const existingActions = R.indexBy(challenge.actions, x => x.id);
    const removedIds = R.difference(
      challenge.actions.map(x => x.id),
      actionIds
    );
    return Rx.forkJoin([
      Rx.from(actionIds).pipe(
        Rx.mergeMap(id => {
          const existing = existingActions[id];
          if (!existing) {
            return createChallengeAction({
              ...getActionData(id, formValues),
              challengeId: challenge.id,
              addedByUserId: user!.id,
              addedDate: new Date(),
            });
          } else {
            return updateChallengeAction(id, {
              ...getActionData(id, formValues),
              challengeId: challenge.id,
              addedByUserId: existing.addedByUserId,
              addedDate: existing.addedDate,
            });
          }
        }),
        Rx.toArray()
      ),
      Rx.from(removedIds).pipe(
        Rx.mergeMap(id => deleteChallengeAction(id)),
        Rx.toArray()
      ),
    ]).pipe(Rx.mergeMap(() => updateChallenge(challenge.id, values)));
  } else {
    return createChallenge({
      ...values,
      actions: actionIds.map(id => {
        return {
          addedByUserId: user!.id,
          addedDate: new Date(),
          ...getActionData(id, formValues),
        };
      }),
    });
  }
}
