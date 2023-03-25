import { CreditSubtype } from '@marketplace/ui-kit';

export type CreditFisCreateParams = {
  vehicleId: number;
  salesOfficeId: number;
  initialPayment: number;
  term: number;
  creditAmount: number;
  creditDiscount: number;
  rate: number;
  monthlyPayment: number;
  subtype: CreditSubtype;
  vehicleCost: number;
};
