import { registerEnumType } from 'type-graphql';

export enum EApplicationStatus {
  CREATED = 'CREATED',
  IN_REVIEW = 'IN_REVIEW',
  COMPLETED = 'COMPLETED',
  APPLICATION_VALIDATION_FAILED = 'APPLICATION_VALIDATION_FAILED',
}

registerEnumType(EApplicationStatus, { name: 'EApplicationStatus' });
