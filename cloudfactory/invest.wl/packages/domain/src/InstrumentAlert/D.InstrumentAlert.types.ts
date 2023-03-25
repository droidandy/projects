import {
  IApiResponse,
  IDInstrumentAlertCountRequestDTO,
  IDInstrumentAlertCountResponseDTO,
  IDInstrumentAlertListDeleteRequestDTO,
  IDInstrumentAlertListDeleteResponseDTO,
  IDInstrumentAlertListRequestDTO,
  IDInstrumentAlertListResponseDTO,
  IDInstrumentAlertSetRequestDTO,
  IDInstrumentAlertSetResponseDTO,
  IDInstrumentAlertViewedUpdateRequestDTO,
  IDInstrumentAlertViewedUpdateResponseDTO,
} from '@invest.wl/core';

export const DInstrumentAlertAdapterTid = Symbol.for('DInstrumentAlertAdapterTid');

export interface IDInstrumentAlertAdapter {
  count(req: IDInstrumentAlertCountRequestDTO): Promise<IApiResponse<IDInstrumentAlertCountResponseDTO>>;
  set(req: IDInstrumentAlertSetRequestDTO): Promise<IApiResponse<IDInstrumentAlertSetResponseDTO>>;
  list(req: IDInstrumentAlertListRequestDTO): Promise<IApiResponse<IDInstrumentAlertListResponseDTO>>;
  listDelete(req: IDInstrumentAlertListDeleteRequestDTO): Promise<IApiResponse<IDInstrumentAlertListDeleteResponseDTO>>;
  viewedUpdate(req: IDInstrumentAlertViewedUpdateRequestDTO): Promise<IApiResponse<IDInstrumentAlertViewedUpdateResponseDTO>>;
  readonly updateInterval: number;
}
