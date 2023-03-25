// сохраняет уведомление, обозначим метод как @AlertSave
export interface ISaveAlertRequest {
  alertId: number; // id уведомления, для нового уведомления всегда передаем 0.
  instrumentId: number;
  targetPrice: number;
  classCode: string;
  securCode: string;
}

export interface ISaveAlertResponse {
  AlertId: number;
}
