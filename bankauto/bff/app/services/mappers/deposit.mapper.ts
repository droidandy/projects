import { DepositRates } from '@marketplace/ui-kit/types';
import { DepositRatesDTO } from 'types/dtos/deposit.dto';

export const DepositRateMapper = <T>(item: T, dto: DepositRatesDTO): T & DepositRates => {
  return {
    ...item,
    id: dto.id,
    term: dto.term,
    turnover: dto.turnover,
    options: dto.options,
    rate: dto.rate,
    addition: dto.addition,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
};
