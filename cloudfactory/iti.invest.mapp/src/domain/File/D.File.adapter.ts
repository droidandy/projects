import {
  IApiResponse, IDFileDownloadRequestDTO, IDFileDownloadResponseDTO, IDFileUploadRequestDTO, IDFileUploadResponseDTO,
  Inject, Injectable,
} from '@invest.wl/core';
import { IDFileAdapter } from '@invest.wl/domain/src/File/D.File.types';
import {
  STransportFileService, STransportFileServiceTid,
} from '@invest.wl/system/src/Transport/File/S.TransportFile.service';
import { ISFileService, SFileServiceTid } from '@invest.wl/system/src/File/S.File.types';

@Injectable()
export class DFileAdapter implements IDFileAdapter {
  constructor(
    @Inject(STransportFileServiceTid) private _fileTp: STransportFileService,
    @Inject(SFileServiceTid) private _fileService: ISFileService,
  ) {}

  public download(req: IDFileDownloadRequestDTO): Promise<IApiResponse<IDFileDownloadResponseDTO>> {
    return this._fileService.download(req.uri).then(res => ({ code: 0, data: {} }));
  }

  public upload(req: IDFileUploadRequestDTO): Promise<IApiResponse<IDFileUploadResponseDTO>> {
    return this._fileTp.Upload(req).then(res => ({ code: 0, data: { id: res.upid } }));
  }
}
