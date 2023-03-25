import { ReviewVehicleCharacteristics } from 'types/Review';

export type Node = {
  label: string;
  value: string | number;
};

type MappedKeys =
  | keyof Omit<
      ReviewVehicleCharacteristics,
      'volume' | 'generation' | 'power' | 'brand' | 'model' | 'avitoModificationId'
    >
  | 'modification';

type MappedCharacteristics = {
  [P in MappedKeys]: Node;
};

export const getMappedCharacteristics = (data: ReviewVehicleCharacteristics): MappedCharacteristics => ({
  year: {
    label: 'Год выпуска',
    value: data.year,
  },
  modification: {
    label: 'Модификация',
    value: `${data.generation.name} (${data.power} л.с.)`,
  },
  bodyType: {
    label: 'Тип кузова',
    value: data.bodyType.name,
  },
  ownershipTerm: {
    label: 'Срок владения',
    value: data.ownershipTerm.name,
  },
  transmission: {
    label: 'Коробка',
    value: data.transmission.name,
  },
  mileage: {
    label: 'Пробег',
    value: `${data.mileage} км`,
  },
  drive: {
    label: 'Привод',
    value: data.drive.name,
  },
  highwayFuelConsumption: {
    label: 'Расход топлива по трассе',
    value: `${data.highwayFuelConsumption} л/100 км`,
  },
  engine: {
    label: 'Двигатель',
    value: data.engine.name,
  },
  cityFuelConsumption: {
    label: 'Расход топлива по городу',
    value: `${data.cityFuelConsumption} л/100 км`,
  },
});
