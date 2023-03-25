import { RemontOrder, RemontOrders, UserAuto } from '@marketplace/ui-kit/types/Remont';
import { RemontOrderDTO, RemontOrdersDTO, UserAutoDTO } from '../../types/dtos/remont.dto';
import { pipeMapper } from './utils';

export const RemontOrderBaseMapper = <T>(item: T, dto: RemontOrderDTO): T & RemontOrder => {
  return {
    ...item,
    autoId: dto.auto_id,
    createdAt: dto.created_at,
    description: dto.description,
    desiredRepairTime: dto.desired_repair_time,
    externalId: dto.external_id,
    id: dto.id,
    lat: dto.lat,
    long: dto.long,
    radius: dto.radius,
    needEvacuator: dto.need_evacuator,
    ownSpareParts: dto.own_spare_parts,
    status: dto.status,
    updatedAt: dto.updated_at,
    userId: dto.user_id,
    vin: dto.vin,
    workTime: dto.work_time,
  };
};

export const RemontOrderMapper = pipeMapper(RemontOrderBaseMapper);

export const RemontOrdersMapper = (dto: RemontOrdersDTO): RemontOrders => {
  return dto.map((order) => RemontOrderMapper({}, order));
};

export const UserAutoMapper = <T>(item: T, dto: UserAutoDTO): T & UserAuto => {
  return {
    ...item,
    id: dto.id,
    deleted: dto.deleted,
    year: dto.year,
    vin: dto.vin,
    type: dto.type,
    diagnosticCard: dto.diagnostic_card,
    insurancePolicyOsago: dto.insurance_policy_osago,
    insurancePolicyKasko: dto.insurance_policy_kasko,
    licencePlate: dto.licence_plate,
    mark: {
      id: dto.mark.id,
      name: dto.mark.name,
      image: dto.mark.image,
      typeId: dto.mark.type_id,
      sortId: dto.mark.sort_id,
    },
    model: {
      id: dto.model.id,
      name: dto.model.name,
    },
    sts: {
      number: dto.sts.number,
      firstName: dto.sts.first_name,
      lastName: dto.sts.last_name,
      patronymic: dto.sts.patronymic,
    },
  };
};

export const UserAutosMapper = (dto: UserAutoDTO[]): UserAuto[] => {
  return dto.map((auto) => UserAutoMapper({}, auto));
};
