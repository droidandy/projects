import React, { FC, SyntheticEvent } from 'react';
import cx from 'classnames';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { useStyles } from './VehicleTypeSwitch.styles';

interface Props {
  light?: boolean;
  onChange: (event: SyntheticEvent) => void;
}

const VEHICLE_TYPE = {
  ALL: 0,
  NEW: 1,
  USED: 2,
};

const VEHICLE_TYPE_MAP = {
  [VEHICLE_TYPE.NEW]: VEHICLE_TYPE_ID.NEW,
  [VEHICLE_TYPE.USED]: VEHICLE_TYPE_ID.USED,
};

const VehicleTypeSwitch: FC<Props> = ({ light = false, onChange }) => {
  const s = useStyles();
  const {
    values: { type: activeType },
  } = useVehiclesFilter();

  const handleChange = (event: SyntheticEvent<HTMLFieldSetElement>) => {
    const type = +(event.target as HTMLInputElement).value;

    const target =
      type === VEHICLE_TYPE.NEW || type === VEHICLE_TYPE.USED
        ? { ...event.target, value: VEHICLE_TYPE_MAP[type] }
        : { ...event.target, value: null };

    onChange({ ...event, target });
  };

  return (
    <fieldset id="vehicleType" onChange={handleChange} className={cx(s.root, { [s.light]: light })}>
      <label htmlFor="all" className={cx(s.label, { [s.active]: activeType !== 0 && !activeType })}>
        Все
        <input id="all" type="radio" value="" name="vehicleType" className={s.input} />
      </label>
      <label htmlFor="new" className={cx(s.label, { [s.active]: activeType === 0 })}>
        Новые
        <input id="new" type="radio" value={VEHICLE_TYPE.NEW} name="vehicleType" className={s.input} />
      </label>
      <label htmlFor="used" className={cx(s.label, { [s.active]: activeType === 1 })}>
        С пробегом
        <input id="used" type="radio" value={VEHICLE_TYPE.USED} name="vehicleType" className={s.input} />
      </label>
    </fieldset>
  );
};

export default VehicleTypeSwitch;
