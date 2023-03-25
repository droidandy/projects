export interface IDOwnerDTO {
  address: string;
  phone: string;
  phoneCallCenter: string;
  emailHelp: string;
  emailCustomer: string;
  emailTechnical: string;
}

export enum EDOwnerContactType {
  Email,
  Phone
}

export enum EDOwnerSubject {
  Service = 1,
  Other
}
