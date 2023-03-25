export type VehicleImportLogItemDTO = {
  company_id: number;
  created_at: number;
  file_id: number;
  finished_at: number;
  id: number;
  offer_deactivated: 0 | 1;
  offer_total: number;
  offer_updated: 0 | 1;
  offer_warning: number;
  raw: string;
  scenario: 1 | 2; // 1 - new, 2 - used
  started_at: number;
  status: 0 | 1 | 2; // 0 - new, 1 - loaded, 2 - error
  type: 0 | 1; // 0 - automatic, 1 - manual
  updated_at: number;
  user_uuid: string;
};

export type ImportFeedDTO = {
  created_at: number;
  id: number;
  updated_at: number;
  url: string;
};
