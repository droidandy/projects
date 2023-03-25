import React, { FC, useMemo } from 'react';
import { Box } from '@marketplace/ui-kit';
import { ColorNew, VEHICLE_TYPE, VehicleNew } from '@marketplace/ui-kit/types';
import { VehicleInstalmentItem } from 'types/Vehicle';
import {
  CarIcon,
  DriveIcon,
  EngineIcon,
  MileageIcon,
  PtsIcon,
  TransmissionIcon,
  UsersIcon,
  VinIcon,
  CalendarIcon,
  ColorIcon,
} from 'icons/vehicleInfoIcons';
import { ComponentProps } from 'types/ComponentProps';
import { Option, VehicleInfoShortItem } from './components/VehicleInfoShortItem';

type VehicleData = {
  type: 'new' | 'used';
  year: number;
  mileage?: number;
  body: string;
  vin: string;
  engine: string;
  enginePower: number | string;
  engineVolume: string;
  drive: string;
  transmission: string;
  ownersNumber?: number;
  color: ColorNew;
};

type ColorVariant = 'circle' | 'icon';

function getEquipmentValues(
  {
    type,
    year,
    mileage,
    body,
    vin,
    engine,
    enginePower,
    engineVolume,
    drive,
    transmission,
    ownersNumber,
    color,
  }: VehicleData,
  colorVariant: ColorVariant,
): Option[] {
  const options =
    type === VEHICLE_TYPE.NEW
      ? [
          { name: 'Год выпуска', value: year, icon: CalendarIcon },
          { name: 'Кузов', value: body, icon: CarIcon },
          { name: 'VIN', value: vin, icon: VinIcon },
          {
            name: 'Двигатель',
            value: engine || enginePower || engineVolume ? `${engineVolume} л / ${enginePower} л.с. / ${engine}` : null,
            icon: EngineIcon,
          },
          { name: 'Привод', value: drive, icon: DriveIcon },
          { name: 'Коробка', value: transmission, icon: TransmissionIcon },
        ]
      : [
          { name: 'Год выпуска', value: year, icon: CalendarIcon },
          {
            name: 'Пробег',
            value: mileage ? `${mileage.toLocaleString('fr')} км` : null,
            icon: MileageIcon,
          },
          { name: 'Кузов', value: body, icon: CarIcon },
          { name: 'VIN', value: vin, icon: VinIcon },
          {
            name: 'Двигатель',
            value: engine || enginePower || engineVolume ? `${engineVolume} л / ${enginePower} л.с. / ${engine}` : null,
            icon: EngineIcon,
          },
          { name: 'Привод', value: drive, icon: DriveIcon },
          { name: 'Коробка', value: transmission, icon: TransmissionIcon },
          ...(ownersNumber ? [{ name: 'Количество собственников', value: ownersNumber || 1, icon: UsersIcon }] : []),
          { name: 'Тип ПТС', value: 'Оригинал', icon: PtsIcon },
        ];

  const colorItem =
    colorVariant === 'circle' ? { name: 'Цвет', value: color } : { name: 'Цвет', value: color.name, icon: ColorIcon };

  return [...options, colorItem];
}

interface Props extends ComponentProps {
  vehicle?: VehicleNew | null;
  vehicleInstalment?: VehicleInstalmentItem | null;
  colorVariant?: ColorVariant;
}

export const VehicleInfoShort: FC<Props> = ({ className, vehicle, vehicleInstalment, colorVariant }: Props) => {
  const equipmentValues = useMemo(() => {
    const vehicleData: VehicleData | null =
      (vehicle && {
        type: vehicle.type,
        year: vehicle.year,
        mileage: vehicle.mileage,
        body: vehicle.body,
        vin: vehicle.vin,
        engine: vehicle.engine.engine,
        enginePower: vehicle.engine.enginePower,
        engineVolume: vehicle.engine.engineVolume,
        drive: vehicle.drive,
        transmission: vehicle.transmission,
        color: vehicle.color,
        ownersNumber: vehicle.ownersNumber,
      }) ||
      (vehicleInstalment && {
        type: vehicleInstalment.type,
        year: vehicleInstalment.year,
        mileage: vehicleInstalment.mileage,
        body: vehicleInstalment.body,
        vin: vehicleInstalment.vin,
        engine: vehicleInstalment.engine,
        enginePower: vehicleInstalment.enginePower,
        engineVolume: vehicleInstalment.engineVolume,
        drive: vehicleInstalment.drive,
        transmission: vehicleInstalment.transmission,
        ownersNumber: vehicleInstalment.numberOfOwners,
        color: vehicleInstalment.color,
      }) ||
      null;

    if (!vehicleData) {
      return null;
    }

    return getEquipmentValues(vehicleData as VehicleData, colorVariant || 'circle');
  }, [colorVariant, vehicle, vehicleInstalment]);

  return !equipmentValues ? null : (
    <Box className={className} px={0.5}>
      {equipmentValues.map((item, index) =>
        item.value ? (
          <Box pt={index ? 1.25 : 0} pb={1.25}>
            <VehicleInfoShortItem {...item} />
          </Box>
        ) : null,
      )}
    </Box>
  );
};
