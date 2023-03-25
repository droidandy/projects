import { IDCustomerAddressDTO, IDCustomerContactDTO, IDCustomerPassportDTO, IDCustomerPersonalDTO } from './D.Customer.dto';

export interface IDCustomerCreateSelfRequestDTO {
  passport: IDCustomerPassportDTO;
  personal: IDCustomerPersonalDTO;
  contact: IDCustomerContactDTO;
  address: IDCustomerAddressDTO;
}

export interface IDCustomerCreateSelfResponseDTO {
  pepSigned: boolean;
  hasAgreement: boolean;
  customerHas: boolean;
}
