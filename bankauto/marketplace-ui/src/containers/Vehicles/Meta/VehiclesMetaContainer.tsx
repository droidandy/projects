import React, { memo, useMemo } from 'react';
import { usePageContext } from 'helpers/context/PageContext';
import { pluralizeAds, pluralizeOffer } from 'constants/pluralizeConstants';
import { useVehiclesMeta } from 'store/catalog/vehicles/meta';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { Meta } from 'components/Meta';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { useRouter } from 'next/router';
import { useCity } from 'store/city';
import { getFormattedCity } from 'helpers/getFormattedCity';
import { useCheckAlias } from 'store/catalog/aliasCheck';

export const VehiclesMetaContainer = memo(() => {
  const { canonical, isCanonical } = usePageContext();
  const {
    meta: { count = 0, minPrice = 0 },
  } = useVehiclesMeta();
  const {
    values: { type, brands, models },
  } = useVehiclesFilter();
  const { current } = useCity();
  const router = useRouter();
  const alias = router.query;
  const { data, fetchAliasCheck, clearAliasData } = useCheckAlias();
  const [isNew, setIsNew] = React.useState<boolean>(type !== null && Number(type) === VEHICLE_TYPE_ID.NEW);
  const [isUsed, setIsUsed] = React.useState<boolean>(Number(type) === VEHICLE_TYPE_ID.USED);
  const currentYears = `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`;
  const isWithType = isNew || isUsed;
  const city = getFormattedCity(current) === '\n в Москве и МО' ? 'в Москве' : getFormattedCity(current);

  React.useEffect(() => {
    if (type !== null) {
      setIsNew(type !== null && Number(type) === VEHICLE_TYPE_ID.NEW);
      setIsUsed(Number(type) === VEHICLE_TYPE_ID.USED);
    }
    if (alias.slug) {
      if (isWithType) {
        fetchAliasCheck(alias.slug[1], alias.slug[2], alias.slug[3]);
      } else {
        fetchAliasCheck(alias.slug[0], alias.slug[1], alias.slug[2]);
      }
    }
    if ((isWithType && alias?.slug?.length === 1) || !alias?.slug?.length) {
      clearAliasData();
    }
  }, [alias.slug, fetchAliasCheck, type, clearAliasData, isWithType]);

  const meta = useMemo(() => {
    const pluralizeCount = isNew ? `${count} ${pluralizeAds(count!)}` : `${count} ${pluralizeOffer(count!)}`;
    const shouldPrintBrand = data?.brand?.alias && brands && brands.length === 1 && brands[0].value;
    const isWithModel = data?.model?.alias && models && models.length === 1 && models[0].value;
    const getVehicleSignature = (isRusVariation?: boolean) => {
      if (!shouldPrintBrand) {
        return '';
      }

      const fieldName = isRusVariation ? 'nameRus' : 'name';
      return data
        ? `${data.brand?.[fieldName]} ${data.model ? data.model[fieldName] : ''} ${
            data.generation ? data.generation[fieldName] || data.generation.name : ''
          }`
        : '';
    };
    const defaultTitle = `Купить ${isNew ? 'новое' : ''} авто ${isUsed ? 'с пробегом' : ''}  ${city} - цены на ${
      isNew ? 'новые' : ''
    } автомобили ${isUsed ? 'с пробегом' : ''} ${currentYears}. Официальный дилер`;
    const textForNew = (isNew && ((shouldPrintBrand && 'новый') || 'новое')) || '';

    const textForFinal =
      (isWithModel && isUsed && `${count ? 'Продажа на #bankauto.ru' : 'на #bankauto. Продажа поддержанных авто'}`) ||
      (isWithModel && `${!count ? 'на #bankauto.' : ''} Официальный дилер, продажа`) ||
      'Продажа, официальный дилер';

    const tempTitle = !shouldPrintBrand
      ? defaultTitle
      : `Купить ${textForNew} ${shouldPrintBrand ? getVehicleSignature(true) : 'авто'} ${isUsed ? 'с пробегом' : ''} ${
          getFormattedCity(current) === '\n в Москве и МО' ? 'в Москве' : getFormattedCity(current)
        } - ${isWithModel ? 'цена' : 'цены'}
     ${(isNew && 'на новые') || (isUsed && `${isWithModel ? 'на б/у' : 'б/у'}`) || ''} ${
          shouldPrintBrand
            ? `${getVehicleSignature()} ${
                (!isWithModel && !isUsed && `и модельный ряд ${currentYears}.`) ||
                (!isWithModel && isUsed && 'и модельный ряд.') ||
                (isWithModel && !isUsed && currentYears) ||
                ''
              }`
            : 'автомобили'
        } ${isWithModel && count ? `от ${minPrice}р.` : ''} ${
          isUsed && !shouldPrintBrand ? 'с пробегом' : ''
        } ${textForFinal}`;

    const tempDescription = `Купить ${textForNew} ${shouldPrintBrand ? getVehicleSignature() : 'авто'} ${
      isUsed ? 'с пробегом' : ''
    } по цене от ${minPrice}р! ${pluralizeCount} по продаже ${isNew && shouldPrintBrand ? 'новых' : ''} ${
      shouldPrintBrand ? getVehicleSignature(true) : 'автомобилей'
    } ${isUsed ? 'с пробегом' : ''} на БанкАвто.ру. Заходите и выбирайте!`;

    return {
      title: tempTitle.replace(/\s+/g, ' '),
      description: tempDescription.replace(/\s+/g, ' '),
    };
  }, [isNew, count, data, brands, models, isUsed, city, currentYears, current, minPrice]);

  return <Meta canonical={!isCanonical ? canonical : undefined} {...meta} />;
});
