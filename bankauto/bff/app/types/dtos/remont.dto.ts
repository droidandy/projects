export type RemontOrderDTO = {
  auto_id: number | null;
  created_at: number;
  description: string;
  desired_repair_time: number | null;
  external_id: string | null;
  id: number;
  lat: number | null;
  radius: number | null;
  long: number | null;
  need_evacuator: number;
  own_spare_parts: number;
  status: number;
  updated_at: number;
  user_id: number;
  vin: number | null;
  work_time: string;
};

export type RemontOrdersDTO = RemontOrderDTO[];

type CarMarkDTO = {
  id: number;
  name: string;
  image?: string;
  type_id: number;
  sort_id: number;
};

type CarModelDTO = {
  id: number;
  name: string;
};

type CarStsDTO = {
  number?: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
};

export type UserAutoDTO = {
  id: number;
  deleted: number;
  diagnostic_card: {
    number?: string;
  };
  insurance_policy_kasko: {
    number?: string;
  };
  insurance_policy_osago: {
    number?: string;
  };
  licence_plate?: string;
  mark: CarMarkDTO;
  model: CarModelDTO;
  sts: CarStsDTO;
  type: string;
  year: number;
  vin?: string;
};
