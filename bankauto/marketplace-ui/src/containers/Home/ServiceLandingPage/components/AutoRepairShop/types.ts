type AutoRepairShopRating = {
  rating: number;
  avgLocation_rate: number;
  avg_qualification_rate: number;
  avg_appearanceRate: number;
  avg_repair_quality_rate: number;
  avg_final_cost_rate: number;
  favorite: string;
  review_count: number;
};

type AutoRepairShopLogo = {
  image: string;
  image_220_200: string;
  image_80_70: string;
};

type AutoRepairShopClassification = {
  stars: number;
  description: string;
};

type AutoRepairShopComfort = {
  phone: boolean;
  wifi: boolean;
  tv: boolean;
  toilet: boolean;
  parking: boolean;
  evacuator: boolean;
  payCard: boolean;
};

type WorkInterval = {
  is_active: boolean;
  from?: string;
  to?: string;
  all_day?: boolean;
};

type Schedule = {
  weekdays: WorkInterval;
  weekends: WorkInterval;
  holidays: WorkInterval;
};

type AutoRepairShopWorkTime = {
  weekdays: WorkInterval;
  weekends: WorkInterval;
  holidays: WorkInterval;
};

type WorkSchedule = {
  days: number[];
  weekdays_time?: string;
  weekends_time?: string;
  holidays_time?: string;
};

export type AutoRepairShop = {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  extension: number;
  lat: number;
  long: number;
  service_rating: AutoRepairShopRating;
  logo: AutoRepairShopLogo;
  service_classification: AutoRepairShopClassification;
  comfort: AutoRepairShopComfort;
  payment_is_active: boolean;
  is_highlighted: boolean;
  is_topped: boolean;
  schedule: Schedule;
  working_time: AutoRepairShopWorkTime;
  work_types: any[];
  work_schedule: WorkSchedule;
  has_promotion: boolean;
};

export interface Props {
  item: AutoRepairShop;
  onPress?: (serviceId: number) => void;
  disabled?: boolean;
}
