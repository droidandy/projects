import { CancellableAxiosPromise } from 'api/request';

export enum INSPECTION_VEHICLE_TYPE {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum INSPECTION_VEHICLE_STATUS {
  NEW = 'NEW',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
  REDEEMED = 'REDEEMED',
}

interface Node {
  id: number;
  alias: string;
  name: string;
}

export interface InspectionVehicleData {
  id: number;
  vin: string;
  images: string[];
  brand: Node;
  model: Node;
  generation: string;
  transmission: string;
  drive: string;
  engine: string;
  mileage: number;
  equipment: { volume: number; power: number };
  color: string;
  productionYear: number;
  price: number;
}

export interface InspectionVehicle {
  id: number;
  type: INSPECTION_VEHICLE_TYPE;
  status: INSPECTION_VEHICLE_STATUS;
  reportUrl: string | null;
  vehicle: InspectionVehicleData;
}

export interface InspectionsState {
  loading: boolean;
  items: InspectionVehicle[];
}
export interface InspectionsActions {
  setLoading: (value: boolean) => void;
  fetchItems: () => void;
  handleRemove: (id: number) => () => void;
  handleCreate: (vehicleId: number | string, cbSuccess: (orderId: number) => void) => Promise<void>;
}

export interface InspectionsProviderActions {
  getInspections: () => CancellableAxiosPromise<InspectionVehicle[]>;
  removeInspection: (id: number | string) => CancellableAxiosPromise<any>;
  createInspection: (vehicleId: number | string) => CancellableAxiosPromise<{ orderId: number }>;
}

export interface InspectionsProviderProps {
  value: InspectionsProviderActions;
}
