import React from 'react';

export type FileStatus = 'initial' | 'loading' | 'accepted' | 'rejected';

export interface FileDescription {
  message?: React.ReactNode;
  status?: FileStatus;
}

export interface FileExtended<E = any> extends File, FileDescription {
  id: string;
  options?: E;
}

export interface FileUrl {
  src: string;
}

export type FileObject<FE extends FileExtended = FileExtended> = FE & FileUrl;
