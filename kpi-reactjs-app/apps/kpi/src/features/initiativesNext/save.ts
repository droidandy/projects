import * as R from 'remeda';
import { getInitiativesState } from './interface';
import { getInfoFormState } from './info-form';
import { getGlobalState } from '../global/interface';
import { InitiativeItemType, Roles } from 'src/types-next';
import {
  createInitiativeExtended,
  updateInitiativeExtended,
} from 'src/services/API-next';
import { isNullOrEmpty } from 'src/common/utils';

function fixId<T extends { id: number }>(item: T) {
  if (item.id < 0) {
    delete item.id;
  }
  return item;
}

function getDiff<T extends { id: number }>(existing: T[], current: T[]) {
  const existingIds = (existing || []).map(x => x.id);
  const currentIds = (current || []).filter(x => x.id > 0).map(x => x.id);
  return R.difference(existingIds, currentIds);
}

export function saveInitiative(draft: boolean) {
  const {
    isAdding,
    initiative,
    activities,
    relatedItems,
    risks,
  } = getInitiativesState();
  const { values: infoValues } = getInfoFormState();
  const { currentUnitId, currentPlanId } = getGlobalState();

  const getInitiative = () => {
    const updaters = infoValues.updaters || [];
    return {
      name: {
        en: infoValues.name_en,
        ar: infoValues.name_ar,
      },
      description: {
        en: infoValues.description_en,
        ar: infoValues.description_ar,
      },
      status: draft ? 'Draft' : 'Active',
      unitId: currentUnitId,
      strategicPlanId: currentPlanId,
      startDate: infoValues.startDate,
      endDate: infoValues.endDate,
      budget: isNullOrEmpty(infoValues.budget)
        ? null
        : Number(infoValues.budget),
      currencyId: infoValues.currency.value,
      fullTimeEquivalent: infoValues.fullTimeEquivalent,
      initiativeType: infoValues.initiativeType.value,
      initiativeLevel: infoValues.initiativeLevel.value,
      projectCode: infoValues.projectCode,
      requireContracting: infoValues.requireContracting,
      contractNumber: infoValues.requireContracting
        ? infoValues.contractNumber
        : null,
      typeId: InitiativeItemType.Initiative,
      projectOutcomes: (infoValues.outcomes || []).map(id => ({
        value: infoValues[`outcome_${id}_value`],
      })),
      userRoles: updaters.map(id => {
        const prefix = `user_${id}_`;
        const allowUpdatingScoringThreshold =
          infoValues[prefix + 'allowUpdatingProgress'];
        return {
          roleId: allowUpdatingScoringThreshold
            ? Roles.InitiativeItemThresholdUpdater
            : Roles.InitiativeItemUpdater,
          userId: id,
        };
      }),
    };
  };

  const getRelatedItems = () => {
    return (infoValues.relatedItems || []).map(item =>
      fixId({
        id: item.id,
        fromObjectType: 'InitiativeItem',
        toObjectType: item.toObjectType,
        toObjectId: item.toObjectId,
      })
    );
  };

  const getActivityList = () => {
    return (infoValues.activities || []).map(item =>
      fixId({
        ...item,
        typeId: InitiativeItemType.Activity,
        currencyId: infoValues.currency.value,
        unitId: currentUnitId,
        strategicPlanId: currentPlanId,
        initiativeSkills: item.initiativeSkills.map(skill => ({
          skillId: skill.skillId,
        })),
      })
    );
  };

  const getRiskList = () => {
    return (infoValues.risks || []).map(item =>
      fixId({
        ...R.omit(item, ['linkedInitiative', 'initiative']),
      })
    );
  };

  if (!initiative || isAdding) {
    const values = {
      initiative: getInitiative(),
      activityList: getActivityList(),
      relatedItemList: getRelatedItems(),
      riskManagementList: getRiskList(),
    } as const;

    return createInitiativeExtended(values);
  } else {
    const values = {
      initiative: getInitiative(),
      activityList: getActivityList(),
      relatedItemList: getRelatedItems(),
      riskManagementList: getRiskList(),
      deletedActivityIdList: getDiff(activities, infoValues.activities),
      deletedRelatedItemIdList: getDiff(relatedItems, infoValues.relatedItems),
      deletedRiskManagementIdList: getDiff(risks, infoValues.risks),
    } as const;
    return updateInitiativeExtended(initiative.id, values);
  }
}
