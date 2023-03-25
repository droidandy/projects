import { CREDIT_SOURCE } from 'constants/credit';
import { CreateCreditApplicationParamsDTO } from 'dtos/CreateCreditApplicationParamsDTO';
import { CreditFisCreateParams } from 'types/CreditFis';

function getCreateCreditFisParamsMapper(
  applicationUuid: string,
  {
    vehicleId,
    salesOfficeId,
    initialPayment,
    creditAmount,
    term,
    creditDiscount,
    rate,
    monthlyPayment,
    subtype,
    vehicleCost,
  }: CreditFisCreateParams,
): CreateCreditApplicationParamsDTO {
  return {
    application_uuid: applicationUuid,
    vehicle_id: vehicleId,
    sales_office_id: salesOfficeId,
    initial_payment: initialPayment,
    amount: creditAmount,
    term,
    discount: creditDiscount,
    source: CREDIT_SOURCE,
    rate,
    monthly_payment: monthlyPayment,
    subtype,
    vehicle_cost: vehicleCost,
  };
}

export { getCreateCreditFisParamsMapper };
