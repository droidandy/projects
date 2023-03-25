import { IVPortfelPresentProps } from './present/V.Portfel.present';
import { IVPortfelInstrumentTypePresentProps } from './present/V.PortfelInstrumentType.present';

export enum EVPortfelScreen {
  Portfel = 'Portfel',
  PortfelInstrumentType = 'PortfelInstrumentType',
}

export interface IVPortfelScreenParams {
  Portfel: IVPortfelPresentProps;
  PortfelInstrumentType: IVPortfelInstrumentTypePresentProps;
}
