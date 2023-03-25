import { USER_PERMISSION, USER_ROLE } from '@marketplace/ui-kit/types/Enum';
import { Access, Identity, Profile, User, Verification } from '@marketplace/ui-kit/types/User';

export const IdentityMock: Identity = {
  id: 1,
  uuid: '1',
};

export const VerificationMock: Verification = {
  isEmailVerified: true,
  isPhoneVerified: true,
};

export const AccessMock: Access = {
  permissions: [USER_PERMISSION.APPLICATIONS_VEHICLE_NEW_LIST],
  roles: [USER_ROLE.WORKER],
};

export const ProfileMock: Profile = {
  phone: '9991112233',
  firstName: 'First',
  lastName: undefined,
  patronymicName: undefined,
  email: 'test@test.test',
  birthday: undefined,
  gender: undefined,
  cityId: 17849,
};

export const UserMock: User = {
  ...IdentityMock,
  ...ProfileMock,
  ...VerificationMock,
  ...AccessMock,
};
