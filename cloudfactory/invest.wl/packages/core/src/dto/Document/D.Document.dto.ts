export interface IDDocumentDTO {
  id: string;
  createDate: string;
  title: string;
  type: EDDocumentType;
  status: EDDocumentStatus;
  storageLink: string;
  sign: IDDocumentSignDTO;
  formattedDate: string;
}

// контекстная сущность (документ \ заявка \ сделка и тд)
export type IDDocumentContextType = string;

export interface IDDocumentSignDTO {
  date: string;
}

export enum EDDocumentType {
  // Сгенерирован
  Generated = 1,
  // Загружен (из бэк-офиса)
  BackOfficeLoaded = 2,
  // Загружен (из мп)
  MpLoaded = 3,
}

export enum EDDocumentStatus {
  Draft = 1,
  New = 2,
  Processed = 3,
  Signed = 4,
  Archive = 5,
  Error = 6,
}

