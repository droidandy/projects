import { TModelId } from '../../types';
import { EDAccountMarketType } from '../Account';
import { TDCurrencyCode } from '../Currency/D.Currency.dto';

export interface IDPortfelSummaryRequestDTO {
  // Date ISO string
  dateFrom: string;
  // Date ISO string
  dateTo: string;
  currencyName: TDCurrencyCode;
  agreementIdList: TModelId[];
  accountIdList?: TModelId[];
}

export interface IDPortfelSummaryResponseDTO extends Array<IDPortfelSummaryItemDTO> {
}

export interface IDPortfelSummaryItemDTO {
  // id = account.id
  id: TModelId;
  Account: IDPortfelSummaryAccountDTO;
  // TODO: NOT EXIST!
  Agreement: IDPortfelSummaryAgreementDTO;
  MarketValue: number;
  FreeCash: number;
  Assets: number;
  AvailableForLoan: number;
  MarginRatio: number;
  PL: number;
  Yield: number;
  Performance: number;
  PLToday: number;
  InitMargin: number;
  MinMargin: number;
  FortsGO: number;
  InAllAssets: number;
  LimNonMargin: number;
  ValShort: number;
  ValLong: number;
  OpenBal: number;
  UDS: number;
  CDS: number;
  VarMargin: number;
  CbpPrevLimit: number;
  CbplUsed: number;
  CorrectedMargin: number;
  NPR1: number;
  NPR2: number;
}

export interface IDPortfelSummaryAccountDTO {
  // id = accountId
  id: TModelId;
  Name: string;
  DisplayName: string;
  MarketType: EDAccountMarketType;
}

export interface IDPortfelSummaryAgreementDTO {
  Name: string;
}
