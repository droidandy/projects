import { VehiclesFilterValues } from 'types/VehiclesFilterValues';

export interface InstalmentFilterProps {
  handleSubmit(): void;
  onChange(values: VehiclesFilterValues): void;
  placeholderFrom(): string | JSX.Element;
  placeholderTo(): string | JSX.Element;
}
