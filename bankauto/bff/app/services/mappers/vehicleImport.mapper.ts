import { ImportFeed, VehicleImportLogItem } from '@marketplace/ui-kit/types';
import { VehicleImportLogStatus, VehicleImportLogType } from '@marketplace/ui-kit/types/Enum';
import { ImportFeedDTO, VehicleImportLogItemDTO } from '../../types/dtos/vehicleImport.dto';

const vehicleImportLogStatusMap: { [key: number]: VehicleImportLogStatus } = {
  0: VehicleImportLogStatus.NEW,
  1: VehicleImportLogStatus.LOADED,
  2: VehicleImportLogStatus.ERROR,
};

const vehicleImportLogTypeMap: { [key: number]: VehicleImportLogType } = {
  0: VehicleImportLogType.AUTOMATIC,
  1: VehicleImportLogType.MANUAL,
};

export const VehicleImportLogItemMapper = <T>(item: T, dto: VehicleImportLogItemDTO): T & VehicleImportLogItem => ({
  ...item,
  id: dto.id,
  dateTime: dto.created_at * 1000,
  status: vehicleImportLogStatusMap[dto.status],
  type: vehicleImportLogTypeMap[dto.type],
  offerTotal: dto.offer_total,
  offerUpdated: dto.offer_updated,
  offerDeactivated: dto.offer_deactivated,
  offerWarning: dto.offer_warning,
});

export const VehicleImportFeedMapper = <T>(item: T, dto: ImportFeedDTO): T & ImportFeed => ({
  ...item,
  id: dto.id,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  url: dto.url,
});
