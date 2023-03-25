import { IDCurrencyDTO } from '../Currency';
import { IDBankDTO } from './D.Bank.dto';

export interface IDBankAccountEditDTO {
  // рассчетный счёт
  accountCurrent: string;
  // лицевой счёт
  accountPersonal?: string;
  currency: IDCurrencyDTO;
  bank: Omit<IDBankDTO, 'address'>;
}

export interface IDBankAccountDTO extends IDBankAccountEditDTO {
  id: string;
  // человеко-понятный идентификатор
  humanId?: string;
  status: EDBankAccountStatus;
  description?: string;
  bank: IDBankDTO;
}

export enum EDBankAccountStatus {
  Inactive = 0,
  Active = 1,
  Blocked = 2,
  Deleted = 3,
}
