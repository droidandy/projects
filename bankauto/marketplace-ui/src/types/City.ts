export interface City {
  id: number | null;
  name: string;
  alias: string;
  cases: {
    prepositional: string;
    seo: string | null;
  };
  vehiclesCount?: number;
}
