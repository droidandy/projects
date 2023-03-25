import { VehicleBaseItem } from '../vehicle';

export type InstallmentPaymentsDtoType = Array<{
  months: number;
  paymentPerMonth: number;
}>;

export type VehicleInstalmentItemDTO = VehicleBaseItem & {
  numberOfOwners: number;
  ptsType: unknown;
  price: number;
  // Возможные параметры рассрочки: количество месяцев - сумма платежа
  installmentPayments: InstallmentPaymentsDtoType;
};
