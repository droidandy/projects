import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { CREDIT_PROGRAM_NAME } from 'constants/credit';

export interface CreditProgramGetterParams {
  /** Название кредитной программы */
  programName?: CREDIT_PROGRAM_NAME;
  /** Цена автомобиля */
  vehiclePrice?: number;
  /** Тип автомобиля */
  type?: VEHICLE_TYPE;
  /** Год выпуска автомобиля */
  year?: number;
  /** Срок кредита */
  term?: number;
  /** Сумма кредита */
  creditAmount?: number;
  /** Первоначальный взнос */
  initialPayment?: number;
  /** Флаг, по которому мы определяем нужны ли пользователю деньги на авто либо наличные */
  justMoney?: boolean;
  /** Флаг, для гибридного кредита */
  isC2C?: boolean;
}
