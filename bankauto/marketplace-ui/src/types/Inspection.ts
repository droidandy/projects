export enum INSPECTION_TYPE {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum INSPECTION_STATUS {
  NEW = 'NEW',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
  REDEEMED = 'REDEEMED',
}

export interface Inspection {
  id: number;
  type: INSPECTION_TYPE;
  status: INSPECTION_STATUS;
  reportUrl: string | null;
}
