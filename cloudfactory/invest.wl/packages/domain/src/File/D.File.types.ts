import { IApiResponse, IDFileDownloadRequestDTO, IDFileDownloadResponseDTO, IDFileUploadRequestDTO, IDFileUploadResponseDTO } from '@invest.wl/core';

export const DFileAdapterTid = Symbol.for('DFileAdapterTid');

export interface IDFileAdapter {
  upload(req: IDFileUploadRequestDTO): Promise<IApiResponse<IDFileUploadResponseDTO>>;
  download(req: IDFileDownloadRequestDTO): Promise<IApiResponse<IDFileDownloadResponseDTO>>;
}
