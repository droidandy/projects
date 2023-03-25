import { SingleApplicationSpecialOffer } from 'types/SingleApplication';
import { CreateCreditApplicationParamsDTO } from './CreateCreditApplicationParamsDTO';

export interface CreateInstalmentApplicationParamsDTO extends CreateCreditApplicationParamsDTO {
  initial_payment_percent?: number | null;
  special_offer?: SingleApplicationSpecialOffer | null;
}
