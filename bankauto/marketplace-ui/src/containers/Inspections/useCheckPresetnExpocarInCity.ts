import { useState, useEffect } from 'react';
import { checkPresetnExpocarInCity } from 'api/client/inspections';

export const useCheckPresetnExpocarInCity = (cityId: number | null = null): boolean => {
  const [available, setAvailable] = useState<boolean>(false);

  useEffect(() => {
    if (cityId) {
      const id = [1, 2].includes(cityId) ? 17849 : cityId;
      checkPresetnExpocarInCity(id)
        .then(({ data }) => {
          setAvailable(data.available);
        })
        .catch((e) => {
          setAvailable((prevData) => prevData && false);
          console.log(e);
        });
    }
  }, [cityId, checkPresetnExpocarInCity]);

  return available;
};
