import * as Yup from 'yup';
import {
  RegistrationSchema,
  AuthorizationSchema,
  AuthenticationSchema,
  IdentitySchema,
  EquipmentSchema,
  HistorySchema,
  PriceSchema,
  ScenarioSchema,
  VinSchema,
} from 'containers/VehicleCreate/FieldSet/schema';

const CreateSchema = RegistrationSchema.concat(AuthenticationSchema)
  .concat(AuthorizationSchema)
  .concat(EquipmentSchema)
  .concat(HistorySchema)
  .concat(IdentitySchema)
  .concat(PriceSchema)
  .concat(ScenarioSchema)
  .concat(VinSchema)
  .shape({});
CreateSchema.withMutation(function (schema) {
  return schema.shape({
    vin: schema.fields.vin.when('isC2C', function vinByScenario(is: boolean, vin: Yup.StringSchema) {
      return is ? vin.required('Необходимо указать VIN') : vin;
    }),
    isC2B: schema.fields.isC2B.when('isC2C', function c2bByScenario(is: boolean, c2b: Yup.BooleanSchema) {
      if (is) {
        return c2b;
      }
      return c2b.equals([true], 'Необходимо выбрать тип объявления');
    }),
  });
});
export { CreateSchema };
