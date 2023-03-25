import { DadataAddressDTO } from './DadataAddressDTO';
import { DadataPartyPersonDTO } from './DadataPartyPersonDTO';

export interface DadataPartyDTO {
  value: string;
  unrestricted_value: string;
  data: {
    kpp: string;
    capital: string | null;
    management: DadataPartyPersonDTO;
    founders: DadataPartyPersonDTO[];
    managers: DadataPartyPersonDTO[];
    branch_type: string;
    branch_count: number;
    source: string | null;
    qc: string | null;
    hid: string;
    type: string;
    state: {
      status: string;
      actuality_date: number;
      registration_date: number;
      liquidation_date: number | null;
    };
    opf: {
      type: string;
      code: string;
      full: string;
      short: string;
    };
    name: {
      full_with_opf: string;
      short_with_opf: string;
      latin: string | null;
      full: string;
      short: string;
    };
    inn: string;
    ogrn: string;
    okato: string;
    oktmo: string;
    okpo: string;
    okogu: string;
    okfs: string;
    okved: string;
    okveds: string | null;
    authorities: string | null;
    documents: string | null;
    licenses: string | null;
    finance: string | null;
    address: DadataAddressDTO;
    phones: string[] | null;
    emails: string[] | null;
    ogrn_date: number;
    okved_type: string;
    employee_count: number | null;
  };
}
