import { AccessMapper, IdentityMapper, ProfileMapper, UserMapper, VerificationMapper } from '../user.mapper';
import { AccessDTOMock, IdentityDTOMock, ProfileDTOMock, UserDTOMock, VerificationDTOMock } from './mock/userDto.mock';
import { AccessMock, IdentityMock, ProfileMock, UserMock, VerificationMock } from './mock/user.mock';

describe('User', () => {
  it('Identity Mapping', () => {
    const r = IdentityMapper({}, IdentityDTOMock);
    expect(r).toEqual(IdentityMock);
  });
  it('Verification Mapping', () => {
    const r = VerificationMapper({}, VerificationDTOMock);
    expect(r).toEqual(VerificationMock);
  });
  it('Access Mapping', () => {
    const r = AccessMapper({}, AccessDTOMock);
    expect(r).toEqual(AccessMock);
  });
  it('Profile Mapping', () => {
    const r = ProfileMapper({}, ProfileDTOMock);
    expect(r).toEqual(ProfileMock);
  });
  it('User Mapping', () => {
    const r = UserMapper({}, UserDTOMock);
    expect(r).toEqual(UserMock);
  });
});
