import {
  IApiResponse,
  IDInstrumentExchangeOptsDTO,
  IDInstrumentExchangeRequestDTO,
  IDInstrumentExchangeResponseDTO,
  IDInstrumentFavoriteUserUpdateRequestDTO,
  IDInstrumentFavoriteUserUpdateResponseDTO,
  IDInstrumentInfoRequestDTO,
  IDInstrumentInfoResponseDTO,
  IDInstrumentMarketHistoryListRequestDTO,
  IDInstrumentMarketHistoryListResponseDTO,
  IDInstrumentQuoteListRequestDTO,
  IDInstrumentQuoteListResponseDTO,
  IDInstrumentSearchRequestDTO,
  IDInstrumentSearchResponseDTO,
  IDInstrumentSummaryRequestDTO,
  IDInstrumentSummaryResponseDTO,
} from '@invest.wl/core';

export const DInstrumentAdapterTid = Symbol.for('DInstrumentAdapterTid');

export interface IDInstrumentAdapter {
  info(req: IDInstrumentInfoRequestDTO): Promise<IApiResponse<IDInstrumentInfoResponseDTO>>;
  summary(req: IDInstrumentSummaryRequestDTO): Promise<IApiResponse<IDInstrumentSummaryResponseDTO>>;
  search(req: IDInstrumentSearchRequestDTO): Promise<IApiResponse<IDInstrumentSearchResponseDTO>>;
  quoteList(req: IDInstrumentQuoteListRequestDTO): Promise<IApiResponse<IDInstrumentQuoteListResponseDTO>>;
  marketHistoryList(req: IDInstrumentMarketHistoryListRequestDTO): Promise<IApiResponse<IDInstrumentMarketHistoryListResponseDTO>>;
  exchangeList(opts: IDInstrumentExchangeOptsDTO): {
    request: (req: IDInstrumentExchangeRequestDTO) => Promise<IApiResponse<IDInstrumentExchangeResponseDTO>>;
    dispose: () => void;
  };
  favoriteUserUpdate(req: IDInstrumentFavoriteUserUpdateRequestDTO): Promise<IApiResponse<IDInstrumentFavoriteUserUpdateResponseDTO>>;
  // config
  readonly quoteListUpdateInterval: number;
  readonly summaryUpdateInterval: number;
  readonly searchTextMinLength: number;
  readonly searchInputDelay: number;
}

