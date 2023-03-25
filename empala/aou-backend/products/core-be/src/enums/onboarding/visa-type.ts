import { registerEnumType } from 'type-graphql';

export enum EVisaType {
  E1 = 'E1',
  E2 = 'E2',
  E3 = 'E3',
  F1 = 'F1',
  H1B = 'H1B',
  L1 = 'L1',
  O1 = 'O1',
  TN1 = 'TN1',
  G4 = 'G4',
}

registerEnumType(EVisaType, { name: 'EVisaType' });
