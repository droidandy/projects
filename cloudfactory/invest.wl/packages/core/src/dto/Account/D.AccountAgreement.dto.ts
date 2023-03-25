import { TModelId } from '../../types';
import { IDAccountItemDTO } from './D.AccountList.dto';
import { IDAccountQUIKItemDTO } from './D.AccountQUIKList.dto';

export interface IDAccountByAgreementDTO<T extends IDAccountItemDTO | IDAccountQUIKItemDTO> {
  // id = agreementId
  id: TModelId;
  AccountList: T[];
}
