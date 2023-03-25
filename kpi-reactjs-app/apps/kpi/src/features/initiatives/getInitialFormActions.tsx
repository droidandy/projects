import { Initiative, Roles } from 'src/types-next';
import { InfoFormActions, getOutcomeKey } from './info-form';
import { getGlobalState } from '../global/interface';
import React from 'react';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { dateToInputFormat } from 'src/common/utils';
import { initiativeTypeOptions } from 'src/common/options';

export function getInitialFormActions(initiative: Initiative | null) {
  if (!initiative) {
    return InfoFormActions.reset();
  }
  const { lookups } = getGlobalState();
  const type = lookups.find(x => x.id === initiative.typeId)!;
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
      type: {
        label: <DisplayTransString value={type} />,
        value: initiative.typeId,
      },
      currency: {
        label: <DisplayTransString value={currency} />,
        value: initiative.currencyId,
      },
      updaters: updaters.map(x => x.userId),
      budget: initiative.budget!,
      startDate: dateToInputFormat(initiative.startDate),
      endDate: dateToInputFormat(initiative.endDate),
      fullTimeEquivalent: initiative.fullTimeEquivalent,
      initiativeType: initiativeTypeOptions.find(
        x => x.value === initiative.initiativeType
      ),
      requireContracting: initiative.requireContracting,
      contractNumber: initiative.contractNumber,
      projectCode: initiative.projectCode,
      outcomes: initiative.projectOutcomes.map(x => x.id),
      skills: initiative.initiativeSkills.map(x => x.skillId),
      ...updatersData,
      ...outcomesData,
    }),
  ];
}
