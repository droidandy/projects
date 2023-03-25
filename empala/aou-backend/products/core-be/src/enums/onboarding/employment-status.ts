import { registerEnumType } from 'type-graphql';

export enum EEmploymentStatus {
  EMPLOYED = 'EMPLOYED',
  UNEMPLOYED = 'UNEMPLOYED',
  RETIRED = 'RETIRED',
  STUDENT = 'STUDENT',
}

registerEnumType(EEmploymentStatus, { name: 'EEmploymentStatus' });
