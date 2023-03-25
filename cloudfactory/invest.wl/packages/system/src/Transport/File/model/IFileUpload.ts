import { IDFileDTO } from '@invest.wl/core';

export interface IFileUploadRequest {
  file: IDFileDTO;
}

export interface IFileUploadBody {
  description: string;
  upid: string;
  submit: Blob;
}

export interface IFileResponse {
  upid: string;
}
