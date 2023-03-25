import { AccessDTO, IdentityDTO, ProfileDTO, VerificationDTO } from '../../types/dtos/user.dto';
import { Access, Identity, Profile, Verification } from '@marketplace/ui-kit/types/User';
import { USER_PERMISSION, USER_ROLE } from '@marketplace/ui-kit/types/Enum';
import { pipeMapper } from '../../services/mappers/utils';

export const IdentityMapper = <T>(item: T, dto: IdentityDTO): T & Identity => ({
  ...item,
  id: dto.id,
  uuid: dto.uuid,
});

export const VerificationMapper = <T>(item: T, dto: VerificationDTO): T & Verification => ({
  ...item,
  isEmailVerified: dto.isEmailVerified,
  isPhoneVerified: dto.isPhoneVerified,
});

export const AccessMapper = <T>(item: T, dto: AccessDTO): T & Access => ({
  ...item,
  permissions: dto.permissions.map((p) => p as any as USER_PERMISSION),
  roles: dto.roles.map((r) => r as any as USER_ROLE),
});

export const ProfileMapper = <T>(item: T, dto: ProfileDTO): T & Profile => ({
  ...item,
  phone: dto.phone,
  firstName: dto.first_name,
  lastName: dto.last_name || undefined,
  patronymicName: dto.patronymic_name || undefined,
  email: dto.email || undefined,
  birthday: dto.birthday || undefined,
  gender: dto.gender === null ? undefined : dto.gender,
  cityId: dto.city_id,
});

export const UserMapper = pipeMapper(IdentityMapper, VerificationMapper, AccessMapper, ProfileMapper);
