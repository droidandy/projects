import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { stringifyFilterQuery } from 'helpers/filter';

export const useSaveFilterQuery = () => {
  const router = useRouter();
  const {
    values,
    initial,
    data: { brands, models, generations },
  } = useVehiclesFilter();

  useEffect(() => {
    if (!initial) {
      const { brands: filterValuesBrands, models: filterValuesModels, generations: filterValuesGenerations } = values;
      const isSingleBrand = filterValuesBrands?.length === 1;
      const isSingleModel = filterValuesModels?.length === 1;
      const isSingleGeneration = filterValuesGenerations?.length === 1;

      const carType = values.type != null && (Number(values.type) === VEHICLE_TYPE_ID.USED ? 'used' : 'new');
      let brandName = 'all';
      let modelName = '';
      let generationName = '';

      if (isSingleBrand) {
        brandName = brands.find(({ id }) => id === values.brands![0].value)?.alias || 'all';
        if (isSingleModel) {
          modelName = models.find(({ id }) => id === values.models![0].value)?.alias || '';
          if (isSingleGeneration) {
            generationName = generations.find(({ id }) => id === values.generations![0].value)?.alias || '';
          }
        }
      }

      const q = stringifyFilterQuery({
        ...values,
        brands: [...(isSingleBrand ? [] : values.brands || [])],
        models: [...(isSingleBrand && isSingleModel ? [] : values.models || [])],
        generations: [...(isSingleBrand && isSingleModel && isSingleGeneration ? [] : values.generations || [])],
      });

      const newPathname = `/car${carType ? `/${carType}` : ''}/${brandName !== 'all' ? brandName : ''}${
        modelName ? `/${modelName}` : ''
      }${generationName ? `/${generationName}` : ''}`;

      router.push(
        '/car/[[...slug]]',
        {
          pathname: newPathname,
          query: q,
        },
        { shallow: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, initial]);
};
