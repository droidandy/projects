import { SimplePdfParamsDTO } from 'dtos/SimplePdfParamsDTO';
import {
  APPLICATION_CREDIT_STATUS,
  APPLICATION_TRADE_IN_STATUS,
  APPLICATION_VEHICLE_STATUS,
} from '@marketplace/ui-kit/types';
import { formatFromTimestamp } from 'helpers';
import { SimplePdfDataDTO } from 'dtos/SimplePdfDataDTO';

export function getSimplePdfMappedData(data: SimplePdfDataDTO & { qrCodeUrl: string }): SimplePdfParamsDTO {
  return {
    isMeeting: data.status === APPLICATION_VEHICLE_STATUS.MEETING,
    number: data.number || '',
    createdAt: (data.createdAt && formatFromTimestamp(data.createdAt, 'dd.MM.yyyy')) || '',
    name: data.userFirstName || '',
    brand: data.vehicleBrandName || '',
    model: data.vehicleModelName || '',
    generation: data.vehicleGenerationName || '',
    equipment: data.vehicleEquipmentName || '',
    vin: data.vehicleVin || '',
    year: data.vehicleYear || 0,
    bodyType: data.vehicleBodyTypeName || '',
    volume: data.vehicleEquipmentVolume || '',
    power: data.vehicleEquipmentPower || 0,
    engine: data.vehicleEngineName || '',
    drive: data.vehicleDriveName || '',
    transmission: data.vehicleTransmissionName || '',
    colorName: data.vehicleColorName || '',
    colorCode: data.vehicleColorCode || '',
    price: data.vehiclePrice || 0,
    isCalculatedTradeIn: data.tradeInStatus === APPLICATION_TRADE_IN_STATUS.CALCULATED,
    tradeInVehicleBrand: data.tradeInVehicleBrandName || '',
    tradeInVehicleModel: data.tradeInVehicleModelName || '',
    tradeInVehicleGeneration: data.tradeInVehicleGenerationName || '',
    tradeInVehiclePrice: data.tradeInVehiclePrice || 0,
    tradeInDiscount: data.tradeInDiscount || 0,
    isCalculatedCredit: data.creditStatus === APPLICATION_CREDIT_STATUS.APPROVED,
    creditDiscount: data.creditDiscount || 0,
    creditValue: data.creditValue || 0,
    creditTerm: data.creditTerm || 0,
    creditMonthlyPayment: data.creditMonthlyPayment || 0,
    creditRate: data.creditRate || '',
    address: data.salesOfficeAddress || '',
    office: data.salesOfficeName || '',
    meetingDate:
      (data.meetingScheduleDateTime && formatFromTimestamp(data.meetingScheduleDateTime, 'dd.MM.yyyy HH:mm')) || '',
    officePhone: data.salesOfficePhones || '',
    qrCodeUrl: data.qrCodeUrl,
  };
}
