export enum EDocumentType {
  // Сгенерирован
  Generated = 1,
  // Загружен (из бэк-офиса)
  BackOfficeLoaded = 2,
  // Загружен (из мп)
  MpLoaded = 3,
}

export enum EDocumentStatus {
  Draft = 1,
  Process = 2,
  Processed = 3,
  Signed = 4,
  Archive = 5,
  Error = 6,
}
