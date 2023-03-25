import * as React from 'react';
import { StrategicPlanValuesTable } from './StrategicPlanTable';
import { StrategicPlanFields } from './StrategicPlanFields';
import { createForm } from 'typeless-form';
import {
  StrategicPlanValuesFormSymbol,
  StrategicPlanValuesSymbol,
} from '../symbol';
import { validateString } from 'src/common/helper';
import { createModule } from 'typeless';
import {
  getStrategicPlanState,
  StrategicPlanActions,
  StrategicPlanIcon,
} from '../interface';

export interface StrategicPlanValuesFormSymbol {
  values_en: string;
  values_ar: string;
}

export const [
  useStrategicPlanFormValues,
  StrategicPlanFormValuesActions,
  getStrategicPlanFormValuesState,
  StrategicPlanFormValuesProvider,
] = createForm<StrategicPlanValuesFormSymbol>({
  symbol: StrategicPlanValuesFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'values_en');
    validateString(errors, values, 'values_ar');
  },
});

export function StrategicPlanForm() {
  handle();
  return (
    <>
      <StrategicPlanFields />
      <StrategicPlanValuesTable />
    </>
  );
}

export const [handle] = createModule(StrategicPlanValuesSymbol);

handle.epic().on(StrategicPlanFormValuesActions.setSubmitSucceeded, () => {
  const { values: formValues } = getStrategicPlanFormValuesState();
  const { icons } = getStrategicPlanState();
  let targetIcon: StrategicPlanIcon | undefined = icons.find(
    el => el.field === 'values'
  );
  const newItem = {
    id: new Date().getTime(),
    text: {
      en: formValues.values_en,
      ar: formValues.values_ar,
    },
    icon: targetIcon ? targetIcon.icon : null,
    iconId: targetIcon ? targetIcon.iconId : null,
  };
  return [
    StrategicPlanActions.setValues(newItem),
    StrategicPlanActions.clearValueIcon(),
    StrategicPlanFormValuesActions.reset(),
  ];
});
