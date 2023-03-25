import { EBool, TModelId } from '../../types';
import { EDAccountMarketType } from '../Account';
import { IDCurrencyDTO, TDCurrencyCode } from '../Currency/D.Currency.dto';
import { EDInstrumentAssetSubType, EDInstrumentAssetType, IDInstrumentIdentityPart } from '../Instrument';
import { EDPortfelOperationType } from './D.Portfel.dto';

export interface IDPortfelPLByInstrumentRequestDTO {
  // Date ISO string
  dateFrom: string;
  // Date ISO string
  dateTo: string;
  agreementIdList: TModelId[];
  assetType?: EDInstrumentAssetType;
  currencyName?: TDCurrencyCode;
  instrumentId?: TModelId;
  accountIdList?: TModelId[];
}

export interface IDPortfelPLByInstrumentResponseDTO extends Array<IDPortfelPLByInstrumentItemDTO> {
}

export interface IDPortfelPLByInstrumentItemDTO {
  // id = instrument.id + '@' + account.id
  id: TModelId;
  Instrument: IDPortfelPLByInstrumentInstrumentDTO;
  MarketValue?: number;
  // TODO: same as Yield? remove?
  TotalPL?: number;
  Yield?: number;
  YieldYear?: number;
  Amount?: number;
  AvgCostPrice?: number;
  Aquisition?: number;
  OperationTypeId?: EDPortfelOperationType;
  // TODO: same as YieldInstrument? remove?
  TotalPLInstr?: number;
  MarketValueInstr?: number;
  AquisitionInstr?: number;
  Account: IDPortfelPLByInstrumentAccountDTO;
  Agreement: IDPortfelPLByInstrumentAgreementDTO;
}

export interface IDPortfelPLByInstrumentInstrumentDTO extends IDInstrumentIdentityPart {
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
  Currency: IDCurrencyDTO;
}

export interface IDPortfelPLByInstrumentAccountDTO {
  // id = accountId
  id: TModelId;
  Name: string;
  DisplayName: string;
  MarketType: EDAccountMarketType;
}

export interface IDPortfelPLByInstrumentAgreementDTO {
  Name: string;
  DU?: EBool;
  IIS?: EBool;
}
