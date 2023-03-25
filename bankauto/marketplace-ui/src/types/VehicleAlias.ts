export type VehicleAlias = {
  id: number;
  name: string;
  nameRus?: string;
  alias: string;
};

export type VehicleAliasesInfo = {
  brand: VehicleAlias;
  model: VehicleAlias | null;
  generation: VehicleAlias | null;
};
