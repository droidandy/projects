import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';

export const isNew = ({ type }: { type: VEHICLE_TYPE }): boolean => type === VEHICLE_TYPE.NEW;

export const carTypeSwitch = <T = any>({ type }: { type: VEHICLE_TYPE }, isNew: T, isUsed: T): T =>
  ({ [VEHICLE_TYPE.NEW]: isNew, [VEHICLE_TYPE.USED]: isUsed }[type]);
