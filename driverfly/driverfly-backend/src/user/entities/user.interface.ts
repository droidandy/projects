import { UserRole } from './user.entity';

export interface UserData {
  email: string;
  roles: UserRole;
  id: number;
  name: string;
  activated: boolean;
}

// User Response Object
export interface UserRO {
  user: UserData;
}

export interface EmailVerification {
  email: string;
  emailToken: string;
  timestamp: Date;
}

export interface ForgottenPassword {
  email: string;
  newPasswordToken: string;
  timestamp: Date;
}
