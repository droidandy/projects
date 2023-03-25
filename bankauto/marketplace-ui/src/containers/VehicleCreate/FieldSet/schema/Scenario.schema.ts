import * as Yup from 'yup';
import { VehicleFormSellValuesScenario } from 'types/VehicleFormType';

export const ScenarioSchema = Yup.object<VehicleFormSellValuesScenario>({
  isC2C: Yup.bool().defined(),
  isC2B: Yup.bool().defined(),
}).defined();
