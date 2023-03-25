import {
  EDPortfelGroup,
  IApiResponse,
  IDPortfelMVHistoryRequestDTO,
  IDPortfelMVHistoryResponseDTO,
  IDPortfelPLByInstrumentItemDTO,
  IDPortfelPLByInstrumentRequestDTO,
  IDPortfelPLByInstrumentResponseDTO,
  IDPortfelPLHistoryRequestDTO,
  IDPortfelPLHistoryResponseDTO,
  IDPortfelSummaryRequestDTO,
  IDPortfelSummaryResponseDTO,
  IDPortfelYieldHistoryRequestDTO,
  IDPortfelYieldHistoryResponseDTO,
} from '@invest.wl/core';

export const DPortfelAdapterTid = Symbol.for('DPortfelAdapterTid');
export const DPortfelConfigTid = Symbol.for('DPortfelConfigTid');

export interface IDPortfelAdapter {
  summary(req: IDPortfelSummaryRequestDTO): Promise<IApiResponse<IDPortfelSummaryResponseDTO>>;
  plByInstrument(req: IDPortfelPLByInstrumentRequestDTO): Promise<IApiResponse<IDPortfelPLByInstrumentResponseDTO>>;
  yieldHistory(req: IDPortfelYieldHistoryRequestDTO): Promise<IApiResponse<IDPortfelYieldHistoryResponseDTO>>;
  mvHistory(req: IDPortfelMVHistoryRequestDTO): Promise<IApiResponse<IDPortfelMVHistoryResponseDTO>>;
  plHistory(req: IDPortfelPLHistoryRequestDTO): Promise<IApiResponse<IDPortfelPLHistoryResponseDTO>>;
  readonly plUpdateInterval: number;
}

export interface IDPortfelConfig {
  readonly plUpdateInterval: number;
  readonly groupByAssetSubTypeList: IDPortfelGroupItem[];
  readonly groupByMarketList: IDPortfelGroupItem[];
  readonly groupByAccountMarketTypeList: IDPortfelGroupItem[];
  readonly plGroupMap: IDPortfelGroupMap<IDPortfelPLByInstrumentItemDTO>;
}

export type TDPortfelGroupInstrumentItem = Pick<IDPortfelPLByInstrumentItemDTO, 'OperationTypeId' | 'Instrument' | 'Amount'>;
export type TDPortfelGroupAccountItem = Pick<IDPortfelPLByInstrumentItemDTO, 'Account'>;

export interface IDPortfelGroupItem {
  id: string;
  filter(item: TDPortfelGroupInstrumentItem | TDPortfelGroupAccountItem): boolean;
}

export type IDPortfelGroupMap<I> = {
  [L in EDPortfelGroup]: (list: I[]) => IDPortfelGroupItem[]
};
