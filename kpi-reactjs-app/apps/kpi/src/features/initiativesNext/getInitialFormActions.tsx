import { Roles } from 'src/types-next';
import { InfoFormActions, getOutcomeKey } from './info-form';
import { getGlobalState } from '../global/interface';
import React from 'react';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { dateToInputFormat } from 'src/common/utils';
import {
  initiativeTypeOptions,
  initiativeLevelOptions,
} from 'src/common/options';
import { getInitiativesState } from './interface';

export function getInitialFormActions() {
  const { initiative, risks, relatedItems, activities } = getInitiativesState();
  if (!initiative) {
    return InfoFormActions.reset();
  }
  const { lookups } = getGlobalState();
  const currency = lookups.find(x => x.id === initiative.currencyId)!;
  const updaters = initiative.userRoles.filter(
    x =>
      x.roleId === Roles.InitiativeItemUpdater ||
      x.roleId === Roles.InitiativeItemThresholdUpdater
  );
  const updatersData = updaters.reduce((ret, item) => {
    const prefix = `user_${item.userId}_`;
    ret[prefix + 'allowUpdatingProgress'] =
      item.roleId === Roles.BscItemThresholdUpdater;
    return ret;
  }, {} as { [x: string]: any });

  const outcomesData = initiative.projectOutcomes.reduce((ret, item) => {
    ret[getOutcomeKey(item.id, 'value')] = item.value;
    return ret;
  }, {} as { [x: string]: any });

  return [
    InfoFormActions.reset(),
    InfoFormActions.changeMany({
      name_ar: initiative.name.ar,
      name_en: initiative.name.en,
      description_ar: initiative.description.ar,
      description_en: initiative.description.en,
      startDate: dateToInputFormat(initiative.startDate),
      endDate: dateToInputFormat(initiative.endDate),
      budget: initiative.budget!,
      currency: {
        label: <DisplayTransString value={currency} />,
        value: initiative.currencyId,
      },
      fullTimeEquivalent: initiative.fullTimeEquivalent,
      initiativeType: initiativeTypeOptions.find(
        x => x.value === initiative.initiativeType
      ),
      initiativeLevel: initiativeLevelOptions.find(
        x => x.value === initiative.initiativeLevel
      ),
      projectCode: initiative.projectCode,
      requireContracting: initiative.requireContracting,
      contractNumber: initiative.contractNumber,
      outcomes: initiative.projectOutcomes.map(x => x.id),
      ...outcomesData,
      updaters: updaters.map(x => x.userId),
      ...updatersData,
      risks,
      relatedItems,
      activities,
    }),
  ];
}
