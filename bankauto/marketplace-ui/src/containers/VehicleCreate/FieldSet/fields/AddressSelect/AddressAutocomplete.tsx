import { AutocompleteOption } from '../../../../../components/Autocomplete';
import { asyncDebounce } from 'helpers/asyncDebounce';
import React, { ChangeEvent, useCallback, useEffect } from 'react';
import { memo } from 'react';
import { AsyncAutocomplete } from 'components/Autocomplete/Autocomplete';
import { initMap } from '../Map/utils';
import { AddressAutocompleteOption } from './AddressAutocompleteOption';
import { AddressContainer } from '../../../../../types/VehicleFormType';

type AddressAutocompleteProps = {
  address?: AddressContainer | null;
  onAddressSelect: (address: AddressContainer) => void;
};

export const AddressAutocomplete = memo(({ address = null, onAddressSelect }: AddressAutocompleteProps) => {
  useEffect(() => {
    const { ymaps } = window as any;
    if (!ymaps) {
      initMap();
    }
  }, []);

  const searchAddress = async (query: string, count: number = 10) => {
    const { ymaps } = window as any;

    if (!ymaps) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(searchAddress(query, count));
        }, 500);
      });
    } else {
      const res = await ymaps.geocode(query, {
        results: count,
      });

      return res.geoObjects;
    }
  };

  const handleLoadAddressOptions = async (query: string): Promise<AutocompleteOption<AddressContainer>[]> => {
    if (!query) {
      return [];
    }

    const res = await searchAddress(query);

    return res.toArray().map((geoObject: any) => ({
      label: geoObject.getAddressLine(),
      value: {
        address: geoObject.getAddressLine(),
        location: geoObject.geometry.getCoordinates(),
      },
    }));
  };

  const handleDebounceLoadAddressOptions = asyncDebounce(handleLoadAddressOptions, 500) as (
    query: string,
  ) => Promise<AutocompleteOption[]>;

  const handleChange = (e: ChangeEvent<Record<string, unknown>>, value: any) => {
    if (value) {
      const { value: address } = value as AutocompleteOption<AddressContainer>;
      onAddressSelect(address);
    }
  };

  const renderOption = useCallback((label: string) => <AddressAutocompleteOption label={label} />, []);

  return (
    <AsyncAutocomplete
      name="address"
      placeholder="Адрес"
      variant="outlined"
      loadOptions={handleDebounceLoadAddressOptions}
      filterOptions={(options: any) => options}
      onChange={handleChange}
      value={
        address
          ? {
              label: address.address,
              value: address,
            }
          : null
      }
      renderOption={renderOption}
    />
  );
});
