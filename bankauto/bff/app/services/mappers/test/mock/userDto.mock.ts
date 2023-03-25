import { AccessDTO, IdentityDTO, ProfileDTO, UserDTO, VerificationDTO } from '../../../../types/dtos/user.dto';

export const IdentityDTOMock: IdentityDTO = {
  id: 1,
  uuid: '1',
};

export const VerificationDTOMock: VerificationDTO = {
  isEmailVerified: true,
  isPhoneVerified: true,
};

export const AccessDTOMock: AccessDTO = {
  permissions: ['applications.vehicle.new.list'],
  roles: ['dealer.worker'],
};

export const ProfileDTOMock: ProfileDTO = {
  phone: '9991112233',
  first_name: 'First',
  last_name: null,
  patronymic_name: null,
  email: 'test@test.test',
  birthday: null,
  gender: null,
  city_id: 17849,
};

export const UserDTOMock: UserDTO = {
  ...IdentityDTOMock,
  ...VerificationDTOMock,
  ...AccessDTOMock,
  ...ProfileDTOMock,
};
