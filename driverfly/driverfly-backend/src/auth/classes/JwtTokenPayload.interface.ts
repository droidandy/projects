export interface JwtTokenPayload {
  // userId
  sub: number;
  // email
  email: string;
  // userId
  user: number;
  // roles == "admin"
  super_admin: boolean;
  // enumerated list of CAN* permissions assigned to user
  permissions: string[];
  // companyId
  company: number;
}
