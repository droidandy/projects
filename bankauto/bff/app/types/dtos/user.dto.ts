export interface IdentityDTO {
  id: number;
  uuid: string;
}

export interface VerificationDTO {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface AccessDTO {
  permissions: string[];
  roles: string[];
}

export interface ProfileDTO {
  phone: string;
  first_name: string;
  last_name: string | null;
  patronymic_name: string | null;
  email: string | null;
  birthday: number | null;
  gender: (0 | 1) | null;
  city_id: number | null;
}

export type UserDTO = IdentityDTO & VerificationDTO & AccessDTO & ProfileDTO;
