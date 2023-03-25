import { VehicleInstalmentItemDTO, InstallmentPaymentsDtoType } from './../../types/dtos/instalment.dto';
import { VehicleInstalmentItem, InstallmentPaymentsType } from './../../types/vehicle';

const getInstallmentPaymentsObject = (data: InstallmentPaymentsDtoType): InstallmentPaymentsType => {
  const newData = {} as InstallmentPaymentsType;
  data.forEach((item) => {
    newData[item.months] = item.paymentPerMonth;
  });
  return newData;
};

export const InstalmentItemMapper = <T extends VehicleInstalmentItemDTO>(item: T): VehicleInstalmentItem => ({
  ...item,
  installmentPayments: getInstallmentPaymentsObject(item.installmentPayments),
});
