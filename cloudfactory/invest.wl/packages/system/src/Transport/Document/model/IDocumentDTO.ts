export enum EDocumentResponseStatus {
  Ok = 'OK', // ответ сформирован успешно;
  Failed = 'FAILED', // ошибка при выполнении запроса, более подробно в message;
  Error = 'ERROR', // ошибка на стороне сервера;
}
