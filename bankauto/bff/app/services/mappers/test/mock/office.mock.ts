import { Coordinates, Office } from '@marketplace/ui-kit/types/Office';
import { WEEK } from '@marketplace/ui-kit/types/Enum';
import { CompanyMock, OfficeBaseMock } from './node.mock';

export const CoordinatesMock: Coordinates = {
  latitude: 1.75,
  longitude: 2.25,
};

export const OfficeDetailedMock: Office = {
  ...OfficeBaseMock,
  ...CoordinatesMock,
  serviceTime: {
    [WEEK.MONDAY]: { isActive: true, timeFrom: '09:00', timeTill: '20:00' },
    [WEEK.TUESDAY]: { isActive: true, timeFrom: '09:00', timeTill: '20:00' },
    [WEEK.WEDNESDAY]: { isActive: true, timeFrom: '09:00', timeTill: '20:00' },
    [WEEK.THURSDAY]: { isActive: true, timeFrom: '09:00', timeTill: '20:00' },
    [WEEK.FRIDAY]: { isActive: true, timeFrom: '09:00', timeTill: '20:00' },
    [WEEK.SATURDAY]: { isActive: true, timeFrom: '10:00', timeTill: '19:00' },
    [WEEK.SUNDAY]: { isActive: true, timeFrom: '10:00', timeTill: '19:00' },
  },
  city: undefined,
  company: CompanyMock,
  fisOfficeId: 1,
};
