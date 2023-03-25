import { InsuranceDto, InsurancePoliciesDto } from '../../types/dtos/insurance.dto';
import { Insurance, InsurancePolicy } from '@marketplace/ui-kit/types';

const PoliciesMapper = <T>(item: T, dto: InsurancePoliciesDto): T & InsurancePolicy => ({
  ...item,
  id: dto.id,
  number: dto.policy_number,
  period: dto.insurance_period_month,
  startDate: dto.valid_from,
  finishDate: dto.valid_to,
  pdf: dto.printed_form,
  type: dto.insurance_type,
  vehicle: {
    brand: dto.car_mark,
    model: dto.car_model,
    vin: dto.vin_number,
    number: dto.number_plate,
    modification: dto.car_modification,
  },
});

export const InsuranceMapper = <T>(item: T, dto: InsuranceDto): T & Insurance => ({
  ...item,
  id: dto.id,
  applicationId: dto.application_id,
  orderId: dto.order_id,
  price: dto.order_sum,
  productType: dto.product_type,
  partner: dto.partner,
  owner: {
    name: dto.owner.first_name,
    surname: dto.owner.last_name,
    patronymic: dto.owner.patronymic_name,
  },
  policies: dto.policies.map((i) => PoliciesMapper({}, i)),
});
