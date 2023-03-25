import * as Rx from 'src/rx';
import * as R from 'remeda';
import { getInitiativesState } from './interface';
import { getInfoFormState } from './info-form';
import { getGlobalState } from '../global/interface';
import { InitiativeItemType, Roles } from 'src/types-next';
import {
  createInitiative,
  updateInitiative,
  createInitiativeSkill,
  deleteInitiativeSkill,
} from 'src/services/API-next';
import { UnreachableCaseError } from 'src/common/helper';

export function saveInitiative(draft: boolean) {
  const { initiativeId, isAdding, initiative } = getInitiativesState();
  const { values: infoValues } = getInfoFormState();
  const { currentUnitId, currentPlanId } = getGlobalState();
  const type = infoValues.type.value as InitiativeItemType;

  const fullDate = type === InitiativeItemType.Initiative;

  const basicInfo = {
    name: {
      en: infoValues.name_en,
      ar: infoValues.name_ar,
    },
    description: {
      en: infoValues.description_en,
      ar: infoValues.description_ar,
    },
    typeId: type,
    status: draft ? 'Draft' : 'Active',
    parentId: isAdding
      ? type === InitiativeItemType.Initiative
        ? null
        : initiativeId
      : initiative!.parentId,
    unitId: currentUnitId,
    strategicPlanId: currentPlanId,
    startDate: fullDate ? infoValues.startDate : infoValues.dueDate,
    endDate: fullDate ? infoValues.endDate : infoValues.dueDate,
    budget: Number(infoValues.budget),
    currencyId: infoValues.currency.value,
  } as const;
  const skillIds = infoValues.skills || [];

  const updaters = infoValues.updaters || [];

  const userRoles = updaters.map(id => {
    const prefix = `user_${id}_`;
    const allowUpdatingScoringThreshold =
      infoValues[prefix + 'allowUpdatingProgress'];
    return {
      roleId: allowUpdatingScoringThreshold
        ? Roles.InitiativeItemThresholdUpdater
        : Roles.InitiativeItemUpdater,
      userId: id,
    };
  });

  const getExtraValues = () => {
    switch (type) {
      case InitiativeItemType.Activity: {
        const { skills } = getInitiativesState();
        const skillMap = R.indexBy(skills, x => x.id);
        return {
          projectCode: 'dummy' + Date.now(),
          fullTimeEquivalent: 'x',
          initiativeSkills: skillIds.map(id => {
            const skill = skillMap[id];
            return {
              skillId: skill.id,
              // skill: {
              //   title: skill.title,
              //   type: skill.type === 'Generic' ? 0 : 1,
              // },
            };
          }),
        };
      }
      case InitiativeItemType.Initiative:
        return {
          fullTimeEquivalent: infoValues.fullTimeEquivalent,
          initiativeType: infoValues.initiativeType.value,
          projectCode: infoValues.projectCode,
          requireContracting: infoValues.requireContracting,
          contractNumber: infoValues.requireContracting
            ? infoValues.contractNumber
            : null,
          projectOutcomes: (infoValues.outcomes || []).map(id => ({
            value: infoValues[`outcome_${id}_value`],
          })),
        };
      default:
        throw new UnreachableCaseError(type);
    }
  };

  const values = {
    ...basicInfo,
    userRoles,
    ...getExtraValues(),
  };
  if (!initiative || isAdding) {
    return createInitiative(values);
  } else {
    const existingIds = initiative.initiativeSkills.map(x => x.skillId);
    const skillMap = R.indexBy(initiative.initiativeSkills, x => x.skillId);
    const added = R.difference(skillIds, existingIds);
    const removed = R.difference(existingIds, skillIds);
    return Rx.forkJoin([
      Rx.from(added).pipe(
        Rx.mergeMap(skillId => {
          return createInitiativeSkill({
            skillId,
            initiativeItemId: initiative.id,
          });
        }),
        Rx.toArray()
      ),
      Rx.from(removed).pipe(
        Rx.mergeMap(skillId => {
          const skill = skillMap[skillId];
          return deleteInitiativeSkill(skill.id);
        }),
        Rx.toArray()
      ),
    ]).pipe(
      Rx.mergeMap(() =>
        updateInitiative(initiative.id, {
          ...values,
          initiativeSkills: undefined,
        })
      )
    );
  }
}
