import { IVInstrumentAlertListPresentProps } from './present/V.InstrumentAlertList.present';

export enum EVInstrumentAlertScreen {
  InstrumentAlertActive = 'InstrumentAlertActive',
  InstrumentAlertCompleted = 'InstrumentAlertCompleted',
}

export interface IVInstrumentAlertScreenParams {
  InstrumentAlertActive: IVInstrumentAlertListPresentProps;
  InstrumentAlertCompleted: IVInstrumentAlertListPresentProps;
}
